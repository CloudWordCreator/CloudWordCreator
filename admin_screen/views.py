from django.shortcuts import render, get_object_or_404
from csvManager.models import Text, NoUnitWord, UnitWord, Unit
from django.db import models
from django.http import JsonResponse
from django.db.models import Q

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
    text_id = request.GET.get('text-id')
    text = get_object_or_404(Text, id=text_id)
    # 関連する UnitWord (ユニットに含まれる単語) を取得
    unit_words = UnitWord.objects.filter(unit__text=text)
    # 関連する NoUnitWord (ユニット外の単語) を取得
    no_unit_words = NoUnitWord.objects.filter(text=text)
    words = list(unit_words) + list(no_unit_words)

    return render(request, 'edit_text.html', {'text': text, 'words': words})

# テキストを検索
def search_text(request):
    query = request.GET.get('text_query')
    results = []
    if query:
        results = Text.objects.filter(models.Q(name__icontains=query))
    return render(request, 'text_result.html', {'results': results})

# 単語を検索する
def search_word(request):
    query = request.GET.get('word_query', '')  # 検索クエリ
    text_id = request.GET.get('text_id', None)  # 教材ID

    results = []

    if query and text_id:  # 検索クエリと教材IDがある場合
        try:
            # 対象の教材を取得
            text = Text.objects.get(id=text_id)

            # UnitWord（ユニット内の単語）を検索（英語または日本語で部分一致）
            unit_word_results = UnitWord.objects.filter(
                unit__text=text
            ).filter(
                Q(english__icontains=query) | Q(japanese__icontains=query)  # 英語または日本語で検索
            ).values('english', 'japanese', 'no', 'unit__text__name')

            # NoUnitWord（ユニット外の単語）を検索（英語または日本語で部分一致）
            no_unit_word_results = NoUnitWord.objects.filter(
                text=text
            ).filter(
                Q(english__icontains=query) | Q(japanese__icontains=query)  # 英語または日本語で検索
            ).values('english', 'japanese', 'no', 'text__name')

            # 結果の統合
            results = list(unit_word_results) + list(no_unit_word_results)

        except Text.DoesNotExist:
            return JsonResponse({'results': [], 'error': '指定された教材が見つかりません'})

    elif not text_id:
        return JsonResponse({'results': [], 'error': '教材IDが指定されていません'})

    # JSON形式で結果を返す
    return JsonResponse({'results': results})

# 教材を削除する
def delete_text(request):
    pass