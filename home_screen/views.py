from django.shortcuts import render, redirect
from . import bug_report_writter
from csvManager.models import UnitWord, NoUnitWord

# Create your views here.
# 暫定作るもの
# home画面 - 今まで作った物をまとめるページ
# バグ/問題報告するロジックとページ
## バグ報告→Google SpreadSheetに書き込む & gmailに通知
### gmailはGoogle SpreadSheetのシート2枚目にあるリストに通知をするようにする。

def home(request):
    # home画面では、URLにカーソルを合わせたときに対応している教材一覧を表示するためにデータベースから教材名を取得している。
    # それぞれ分類するため2変数で取得している。
    unit_words = UnitWord.objects.select_related('unit__text').all()
    no_unit_words = NoUnitWord.objects.select_related('text').all()

    flat_test_texts = set(nuw.text.name for nuw in no_unit_words)
    structured_test_texts = set(uw.unit.text.name for uw in unit_words)

    return render(request, 'home.html', {
        'flat_test_texts': flat_test_texts,
        'structured_test_texts': structured_test_texts
    })

def report(request):
    return render(request, 'report.html')

def submit_report(request):
    if request.method == 'POST':
        school_name = request.POST.get('school_name')
        material = request.POST.get('material')
        details = request.POST.get('details')

        report_content = {
            'schoolName' : school_name,
            'material' : material,
            'details' : details,
        }

        sheet_writer = bug_report_writter.SpreadSheetWriter(report_content)
        sheet_writer.write_report()

    return redirect('home')