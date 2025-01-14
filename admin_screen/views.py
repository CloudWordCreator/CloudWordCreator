from django.shortcuts import render
from csvManager.models import Text, NoUnitWord, UnitWord, Unit
from django.db import models

# Create your views here.
# This is the view for the admin page

# admin画面ホーム
def admin(request):
    # ユニットで分けられているテキストを取得
    unit_texts = Text.objects.filter(units__isnull=False).distinct()
    
    # ユニットで分けられていないテキストを取得
    no_unit_texts = Text.objects.filter(no_unit_words__isnull=False).distinct()
    
    return render(request, 'admin home.html', {'unit_texts': unit_texts, 'no_unit_texts': no_unit_texts})

# テキスト選択後の編集画面
def edit_text(request):
    pass

# テキストを検索
def search_text(request):
    query = request.GET.get('text_query')
    results = []
    if query:
        results = Text.objects.filter(models.Q(name__icontains=query))
    return render(request, 'text_result.html', {'results': results})

# 単語を検索する
def search_word(request):
    pass

# 教材を削除する
def delete_text(request):
    pass