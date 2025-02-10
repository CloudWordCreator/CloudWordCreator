from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.shortcuts import redirect
from csvManager.models import Text, Unit, UnitWord

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
    :return
        {
          "unit": "Unit1",
          "sub_units": [
            {
              "name": "Unit1-1",
              "position": "子ユニットがどのテーブルに属するか示す",
              "words": [
                {"No": "英単語の番号かテーブルの位置","english": "apple", "japanese": "りんご"},
                {"No": "英単語の番号かテーブルの位置","english": "book", "japanese": "本"}
              ]
            },
            {
              "name": "Unit1-2",
              "position": "子ユニットがどのテーブルに属するか示す",
              "words": [
                {"No": "英単語の番号かテーブルの位置","english": "cat", "japanese": "猫"},
                {"No": "英単語の番号かテーブルの位置","english": "dog", "japanese": "犬"}
              ]
            }
          ]
        }
    """
    if request.method == 'POST':
        # POST データから選択されたユニットとテキストIDを取得
        selected_unit_ids = request.POST.getlist('selected_units')
        selected_text_ids = request.POST.getlist('selected_texts')

        # 親ユニットを取得
        selected_units = Unit.objects.filter(id__in=selected_unit_ids)
        selected_texts = Text.objects.filter(id__in=selected_text_ids)

        # 複数の親ユニットから子ユニットを取得
        child_units = Unit.objects.filter(parent__in=selected_units)

        # 親ユニットおよび子ユニットに関連する単語を取得
        child_words = UnitWord.objects.filter(unit__in=child_units | selected_units)

        # データを整形して JSON 構造に変換
        response_data = {
            "units": [
                {
                    "name": unit.name,
                    "sub_units": [
                        {
                            "name": subunit.name,
                            "position": subunit.id,  # 必要なら position を計算で追加
                            "words": [
                                {
                                    "No": word.no,  # UnitWord の番号
                                    "english": word.english,
                                    "japanese": word.japanese
                                }
                                for word in subunit.words.all()
                            ]
                        }
                        for subunit in unit.subunits.all()
                    ]
                }
                for unit in selected_units.prefetch_related('subunits__words')
            ]
        }

        # JSON データを返却
        return render(request, 'test_result_dev.html', {"data": response_data})

    # POST でない場合
    return redirect('display_data')
