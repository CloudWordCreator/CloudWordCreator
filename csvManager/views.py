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

import csv
from django.http import HttpResponse
from urllib.parse import quote

@login_required(login_url='/login/')
def upload_csv(request):
    texts = Text.objects.all() # ダウンロード用にリストを取得
    
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
    return render(request, 'set.html', {'texts': texts})

@login_required(login_url='/login/')
def download_csv(request, text_id):
    text = Text.objects.get(id=text_id)
    response = HttpResponse(content_type='text/csv; charset=cp932') # Excelで開けるようにcp932(Shift-JIS)
    
    # 日本語ファイル名対応
    filename = f"{text.name}.csv"
    encoded_filename = quote(filename)
    response['Content-Disposition'] = f"attachment; filename*=UTF-8''{encoded_filename}"

    writer = csv.writer(response)
    
    # Check for Unit structure
    if text.units.exists():
        writer.writerow(['No', 'unit', 'subunit', '英語', '日本語'])
        # ユニットを持つ場合、Unit -> UnitWords の順で取得
        # 親ユニットごとにグループ化して出力するなど工夫が必要だが、
        # ここでは単純に UnitWord をなめていく
        # UnitWord は unit に紐付いている。
        # Unit は parent を持つ可能性がある。
        
        words = UnitWord.objects.filter(unit__text=text).select_related('unit__parent').order_by('id')
        
        for word in words:
            # parentがある場合は unit が subunit、parent が unit になる
            if word.unit.parent:
                unit_col = word.unit.parent.name
                subunit_col = word.unit.name
            else:
                unit_col = word.unit.name
                subunit_col = word.unit.name # or empty? import logic suggests row['unit'] is parent, row['subunit'] is child
            
            writer.writerow([word.no, unit_col, subunit_col, word.english, word.japanese])
            
    # Check for NoUnit structure
    elif text.no_unit_words.exists():
        writer.writerow(['No', '英語', '日本語'])
        words = NoUnitWord.objects.filter(text=text).order_by('no')
        for word in words:
            writer.writerow([word.no, word.english, word.japanese])
            
    return response

@login_required(login_url='/login/')
def success(request):
    return render(request, 'success.html')
