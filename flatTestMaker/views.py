from django.shortcuts import render
from csvManager.models import Text, NoUnitWord
from django.db import models
import random

# デフォルトの問題数 
DEFAULT_COUNTS = 25

# Create your views here.
def settings(request):
    """
    情報を入力するページ 
    """
    # NoUnitWordに関連するTextを取得
    texts = Text.objects.filter(no_unit_words__isnull=False).distinct()
    text_counts = {text.id: text.no_unit_words.count() for text in texts}
    
    return render(request, 'setting.html', {
        'texts': texts,
        'text_counts': text_counts,
    })

def search(request):
    """
    英単語(Unit構造でない)を検索するページ 
    テキスト事の検索と全ての検索付けて、日本語英語の検索に対応させる 
    """
    query = request.GET.get('q')
    selected_text_id = request.GET.get('mySelect')
    results = []
    if query:
        results = NoUnitWord.objects.filter(
            models.Q(english__icontains=query) | models.Q(japanese__icontains=query)
        ).select_related('text')
        if selected_text_id:
            results = results.filter(text_id=selected_text_id)
    return render(request, 'flatTest_search_results.html', {
        'results': results,
        'selected_text_id': selected_text_id,
    })

def generate_words(request):
    """
    単語を生成するページ 
    """
    pass
    """
    暫定の返り値
    return render(request, 'generated_samples25.html', {
        'words' : words,
        'selected_text': selected_text,
        'start_range': start_range,
        'end_range': end_range,
        'question_count': question_count
        }
    )
    """

def generate_sentences(request):
    """
    文を生成するページ 
    gemini flash 1.5のAPIを使用して文を生成する。 
    """
    pass