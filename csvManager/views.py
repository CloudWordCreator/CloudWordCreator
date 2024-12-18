from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .csv_importer import import_csv
import os
from .models import Text, Unit, UnitWord, NoUnitWord

def upload_csv(request):
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']
        text_name = csv_file.name.rsplit('.', 1)[0]  # ファイル名から拡張子を除いた部分をテキスト名として使用
        fs = FileSystemStorage(location=settings.CSV_UPLOAD_DIR)
        filename = fs.save(csv_file.name, csv_file)
        file_path = fs.path(filename)
        import_csv(file_path, text_name)
        # データベースに書き込んだ後、CSVファイルを削除
        os.remove(file_path)
        return redirect('success')
    return render(request, 'set.html')

def success(request):
    return render(request, 'success.html')

def display_data(request):
    """unitを持つテキストの表示 """
    texts_with_units = Text.objects.filter(units__isnull=False).distinct()
    units_by_text = {text.id: text.units.filter(parent__isnull=True) for text in texts_with_units}
    return render(request, 'display_data.html', {'texts': texts_with_units, 'units_by_text': units_by_text})

def display_data_none_unit(request):
    texts_without_units = Text.objects.filter(units__isnull=True).distinct()
    words = NoUnitWord.objects.all()
    return render(request, 'display_data_NoneUnit.html', {'texts': texts_without_units, 'words': words})