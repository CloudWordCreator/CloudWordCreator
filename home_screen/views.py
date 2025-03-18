from django.shortcuts import render, redirect
import random
from . import bug_report_writter
from csvManager.models import UnitWord, NoUnitWord

# Create your views here.
# 暫定作るもの
# home画面 - 今まで作った物をまとめるページ
# バグ/問題報告するロジックとページ
## バグ報告→Google SpreadSheetに書き込む & gmailに通知
### gmailはGoogle SpreadSheetのシート2枚目にあるリストに通知をするようにする。

def home(request):
    unit_words = UnitWord.objects.select_related('unit__text').all()
    no_unit_words = NoUnitWord.objects.select_related('text').all()

    flat_test_texts = list(set(nuw.text.name for nuw in no_unit_words))
    structured_test_texts = list(set(uw.unit.text.name for uw in unit_words))

    flat_test_texts_sample = random.sample(flat_test_texts, min(2, len(flat_test_texts)))
    structured_test_texts_sample = random.sample(structured_test_texts, min(2, len(structured_test_texts)))

    return render(request, 'home.html', {
        'flat_test_texts': flat_test_texts_sample,
        'structured_test_texts': structured_test_texts_sample
    })

def report(request):
    return render(request, 'report.html')

def submit_report(request):
    if request.method == 'POST':
        school_name = request.POST.get('school_name')
        material = request.POST.get('material')
        details = request.POST.get('details')

        report_content = {
            'schoolName': school_name,
            'material': material,
            'details': details,
        }

        sheet_writer = bug_report_writter.SpreadSheetWriter(report_content)
        sheet_writer.write_report()

        return redirect('home')
    else:
        return render(request, 'report.html')