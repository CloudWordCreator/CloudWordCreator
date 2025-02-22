from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.shortcuts import redirect
from csvManager.models import Text, Unit, UnitWord

# global

## 25行使ったら改行して別の表に移行する
MAX_ENTRIES_PER_TABLE = 25


# Create your views here.
def display_data(request):
    """
    階層構造でテキスト、Unit、子Unit、単語を表示
    """
    texts_with_units = Text.objects.filter(units__isnull=False).distinct()
    units_by_text = {
        text.id: text.units.filter(parent__isnull=True).prefetch_related('subunits__words')
        for text in texts_with_units
    }
    return render(request, 'display_data.html', {
        'texts': texts_with_units,
        'units_by_text': units_by_text,
    })

def create_test(request):
    """
    チェックボックスの選択内容に基づいてテストを作成し、表示する。
    returnのjsonファイルについて
    - 親unit
    - 子unit
    - 単語
    - テーブル番号

    テーブルの番号について :
    子unitと単語unitが合計25個になったらテーブル番号を更新している
    Json内はint型で扱う。

    フロントエンドでのテーブル番号の扱いについて :
    左上をテーブル番号1とすると、右上が2、左下が3、右下が4...
    example:
    ```
    1 2
    3 4
    5 6
    ```

    :return
        json file (コード見ろ)
    """
    if request.method == 'POST':
        # POST データから選択されたユニットとテキストIDを取得
        selected_unit_ids = request.POST.getlist('selected_units')
        selected_text_ids = request.POST.getlist('selected_texts')

        # 親ユニットを取得
        selected_units = Unit.objects.filter(id__in=selected_unit_ids)
        selected_texts = Text.objects.filter(id__in=selected_text_ids)

        # データを整形して番号付け
        table_no = 1  # テーブル番号
        entry_count = 0  # 現在のテーブル内の行数カウント
        word_index = 1  # 各単語の全体的なインデックス

        response_data = {
            "units": []
        }

        for unit in selected_units.prefetch_related('subunits__words'):
            unit_data = {
                "name": unit.name,
                "sub_units": []
            }
            for subunit in unit.subunits.all():
                subunit_data = {
                    "name": subunit.name,
                    "position": table_no,  # 子ユニットが属するテーブル番号
                    "words": []
                }
                for word in subunit.words.all():
                    # 各単語を追加し、テーブル番号を考慮した番号付けを行う
                    subunit_data["words"].append({
                        "position": table_no, # 単語が属するテーブルの番号
                        "english": word.english,
                        "japanese": word.japanese
                    })

                    # 単語のカウントを更新
                    word_index += 1
                    entry_count += 1

                    # テーブル内の行数が25を超えたら次のテーブルに移動
                    if entry_count >= MAX_ENTRIES_PER_TABLE:
                        entry_count = 0
                        table_no += 1

                unit_data["sub_units"].append(subunit_data)

                # 子ユニット終了時も行数確認
                entry_count += 1
                if entry_count >= MAX_ENTRIES_PER_TABLE:
                    entry_count = 0
                    table_no += 1

            response_data["units"].append(unit_data)

        # JSON データをテンプレートに渡す
        return render(request, 'test_result.html', {"data": response_data})

    # POST でない場合
    return redirect('display_data')


