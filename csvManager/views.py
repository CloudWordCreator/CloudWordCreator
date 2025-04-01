from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .csv_importer import import_csv
import os
from .models import Text, Unit, UnitWord, NoUnitWord
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class CsvUploadView(LoginRequiredMixin, TemplateView):
    # summary
    # ログイン用の設定
    template_name = 'csv_set/upload.html'
    login_url = '/login/'  # ログイン画面へのリダイレクト

@login_required(login_url='/login/')
def upload_csv(request):
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']
        text_name = csv_file.name.rsplit('.', 1)[0]  # ファイル名から拡張子を除いた部分をテキスト名として使用
        fs = FileSystemStorage(location=settings.CSV_UPLOAD_DIR)
        filename = fs.save(csv_file.name, csv_file)
        file_path = fs.path(filename)
        try:
            import_csv(file_path, text_name)
            # データベースに書き込んだ後、CSVファイルを削除
            os.remove(file_path)
        except KeyError as e:
            # ヘッダーのエラーが発生した場合 
            os.remove(file_path)
            error_text = f"CSVファイルのヘッダーが不正です: {e}"
            return render(request, 'failed.html', {'error': error_text})
        except ValueError as e:
            os.remove(file_path)
            # エンコードエラーが発生した場合 
            return render(request, 'failed.html', {'error': e})
        return redirect('success')
    return render(request, 'set.html')

@login_required(login_url='/login/')
def success(request):
    return render(request, 'success.html')
