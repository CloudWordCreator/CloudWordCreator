from django.shortcuts import render, redirect
from csvManager.models import Text, Unit, UnitWord, NoUnitWord

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
    """
    if request.method == 'POST':
        selected_unit_ids = request.POST.getlist('selected_units')
        selected_text_ids = request.POST.getlist('selected_texts')
        
        # 親ユニットを取得
        selected_units = Unit.objects.filter(id__in=selected_unit_ids)
        selected_texts = Text.objects.filter(id__in=selected_text_ids)
        
        # 複数の親ユニットから子ユニットを取得
        child_units = Unit.objects.filter(parent__in=selected_units)
        
        # 親ユニットおよび子ユニットに関連する単語を取得
        child_words = UnitWord.objects.filter(unit__in=child_units | selected_units)
        
        return render(request, 'test_result.html', {
            'words': child_words,
            'units': selected_units,
            'selected_texts': selected_texts,
        })
    
    return redirect('display_data')