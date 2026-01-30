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
    Structured Test (React)
    """
    return render(request, 'structured_test_react_base.html')

def api_get_structured_settings(request):
    """
    階層構造データをJSONで返す
    """
    try:
        texts_with_units = Text.objects.filter(units__isnull=False).distinct()
        data = []
        for text in texts_with_units:
            units = text.units.filter(parent__isnull=True).prefetch_related('subunits')
            units_data = []
            for unit in units:
                subunits_data = []
                for subunit in unit.subunits.all():
                    subunits_data.append({
                        'id': subunit.id,
                        'name': subunit.name
                    })
                units_data.append({
                    'id': unit.id,
                    'name': unit.name,
                    'subunits': subunits_data
                })
            
            data.append({
                'id': text.id,
                'name': text.name,
                'units': units_data
            })
            
        return JsonResponse({'texts': data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def create_test(request):
    """
    チェックボックスの選択内容に基づいてテストを作成し、表示する。
    サーバーサイドで行数計算（25行/列）を行い、ページ（シート）と列（左右）の構造を作成してテンプレートに渡す。
    これにより、フロントエンドでの複雑な座標計算JSを廃止する。
    """

import json

def api_create_structured_test(request):
    """
    テスト生成API
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_unit_ids = data.get('selected_units', [])

            # 親ユニットを取得
            selected_units = Unit.objects.filter(id__in=selected_unit_ids)
            # Text info logic was weird in original, it got keys from post list...
            # We can infer text from the first unit or just rely on units.
            # Original code: textbooks = [{"id": text.id, "name": text.name} for text in selected_texts]
            # But selected_texts comes from POST.
            # Let's just use the units to find the text.
            header_title = ""
            if selected_units.exists():
                first_unit = selected_units.first()
                header_title = f"{first_unit.text.name} {first_unit.name}"
            
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

            return JsonResponse({
                "sheets": sheets,
                "header_title": header_title,
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST method required'}, status=400)



