from django.shortcuts import render
from csvManager.models import Text, Unit, UnitWord, NoUnitWord

# Create your views here.
def display_data(request):
    """unitを持つテキストの表示 """
    texts_with_units = Text.objects.filter(units__isnull=False).distinct()
    units_by_text = {text.id: text.units.filter(parent__isnull=True) for text in texts_with_units}
    return render(request, 'display_data.html', {'texts': texts_with_units, 'units_by_text': units_by_text})