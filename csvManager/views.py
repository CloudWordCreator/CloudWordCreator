from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .csv_importer import import_csv
import os

def upload_csv(request):
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']
        csv_type = request.POST.get('csv_type')
        text_name = csv_file.name.rsplit('.', 1)[0]  # ファイル名から拡張子を除いた部分をテキスト名として使用
        fs = FileSystemStorage(location=settings.CSV_UPLOAD_DIR)
        filename = fs.save(csv_file.name, csv_file)
        file_path = fs.path(filename)
        import_csv(file_path, csv_type, text_name)
        # データベースに書き込んだ後、CSVファイルを削除
        os.remove(file_path)
        return redirect('success')
    return render(request, 'set.html')

def success(request):
    return render(request, 'success.html')