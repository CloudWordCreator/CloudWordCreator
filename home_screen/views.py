from django.shortcuts import render

# Create your views here.
# 暫定作るもの
# home画面 - 今まで作った物をまとめるページ
# バグ/問題報告するロジックとページ
## バグ報告→Google SpreadSheetに書き込む & gmailに通知
### gmailはGoogle SpreadSheetのシート2枚目にあるリストに通知をするようにする。

def home(request):
    return render(request, 'home.html')

def report(request):
    return render(request, 'report.html')

def submit_report(request):
    if request.method == 'POST':
        school_name = request.POST.get('school_name')
        material = request.POST.get('material')
        details = request.POST.get('details')

        # 暫定print
        print(school_name)
        print(material)
        print(details)
    return render(request, 'home.html')