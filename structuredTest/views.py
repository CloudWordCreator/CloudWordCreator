from django.shortcuts import render, redirect
from csvManager.models import Text, Unit, UnitWord, NoUnitWord

# Create your views here.
def display_data(request):
    """unitを持つテキストの表示 """
    texts_with_units = Text.objects.filter(units__isnull=False).distinct()
    units_by_text = {text.id: text.units.filter(parent__isnull=True) for text in texts_with_units}
    return render(request, 'display_data.html', {'texts': texts_with_units, 'units_by_text': units_by_text})

def create_test(request):
    """
    チェックボックスの選択内容に基づいてテストを作成し、表示する。
    """
    if request.method == 'POST':
        # チェックされた単語IDとユニットIDを取得
        selected_word_ids = request.POST.getlist('selected_words')
        selected_unit_ids = request.POST.getlist('selected_units')
        # 選択されたテキストを取得
        selected_text_ids = request.POST.getlist('selected_texts')
        
        # 選択されたテキスト名、単語とユニットを取得
        selected_words = UnitWord.objects.filter(id__in=selected_word_ids)
        selected_units = Unit.objects.filter(id__in=selected_unit_ids)
        selected_texts = Text.objects.filter(id__in=selected_text_ids)
        
        return render(request, 'test_result.html', {
            'words': selected_words,
            'units': selected_units,
            'selected_texts': selected_texts,
        })
    
    return redirect('display_data')