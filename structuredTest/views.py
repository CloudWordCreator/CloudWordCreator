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
    サーバーサイドで行数計算（25行/列）を行い、ページ（シート）と列（左右）の構造を作成してテンプレートに渡す。
    これにより、フロントエンドでの複雑な座標計算JSを廃止する。
    """
    if request.method == 'POST':
        # POST データから選択されたユニットとテキストIDを取得
        selected_unit_ids = request.POST.getlist('selected_units')
        selected_text_ids = request.POST.getlist('selected_texts')

        # 親ユニットを取得
        selected_units = Unit.objects.filter(id__in=selected_unit_ids)
        selected_texts = Text.objects.filter(id__in=selected_text_ids)

        textbooks = [{"id": text.id, "name": text.name} for text in selected_texts]
        
        # 最初のテキスト名と最初のユニット名（ヘッダー用）
        # 注: 複数選択時は最初のものを表示する既存ロジックを踏襲
        header_text_name = textbooks[0]['name'] if textbooks else ""
        header_unit_name = selected_units[0].name if selected_units else ""
        header_title = f"{header_text_name} {header_unit_name}"

        sheets = []
        current_sheet = {"left": [], "right": []}
        current_column = "left" # 'left' or 'right'
        current_rows = 0
        
        # 行を追加する内部関数
        def add_row(row_data):
            nonlocal current_sheet, current_column, current_rows, sheets
            
            # 25行を超えたら次の列/シートへ
            if current_rows >= MAX_ENTRIES_PER_TABLE:
                if current_column == "left":
                    current_column = "right"
                else:
                    sheets.append(current_sheet)
                    current_sheet = {"left": [], "right": []}
                    current_column = "left"
                current_rows = 0
            
            current_sheet[current_column].append(row_data)
            current_rows += 1

        for unit in selected_units.prefetch_related('subunits__words'):
            for subunit in unit.subunits.all():
                # SubUnit Header
                add_row({
                    "type": "header",
                    "text": subunit.name
                })
                
                for word in subunit.words.all():
                    add_row({
                        "type": "word",
                        "english": word.english,
                        "japanese": word.japanese
                    })
        
        # 最後のシートに残りのデータがあれば追加
        if current_sheet["left"] or current_sheet["right"]:
            sheets.append(current_sheet)

        context = {
            "sheets": sheets,
            "header_title": header_title,
        }

        # JSON データをテンプレートに渡す
        return render(request, 'test_result.html', context)

    # POST でない場合
    return redirect('display_data')


