from django.shortcuts import render
from csvManager.models import Text, NoUnitWord
from django.db import models
import random
from . import ai_prompt as prompt

# デフォルトの問題数 
DEFAULT_COUNT = 25

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
    問題数が25以下の場合 sample25.htmlを使用
    問題数が25以上の場合 sample50.htmlを使用
    """
    if request.method == 'POST':
        # フォームからの情報を取得
        text_id = request.POST.get('mySelect')
        start_range = int(request.POST.get('startNumber'))
        end_range = int(request.POST.get('endNumber'))
        question_count = request.POST.get('questionCount')
        mandatory_words = request.POST.getlist('mandatoryWords[]')

        text = Text.objects.get(id=text_id).name

        # 問題数の設定
        # デフォルト値(フォームが空)ならDEFAULT_COUNTを使用
        # そうでない場合はフォームの値を使用
        count = int(question_count) if question_count else DEFAULT_COUNT
        count -= len(mandatory_words)
        
        # 範囲の設定 
        range_size = end_range - start_range + 1
        if count > range_size:
            # 問題数が範囲の数を超えている場合、範囲の下図に合わせる 
            count = range_size
        
        ids = random.sample(range(start_range, end_range + 1), count)
        words = list(NoUnitWord.objects.filter(text_id=text_id, no__in=ids))
        
        for mondatory_word in mandatory_words:
            english_word, japanese_word = mondatory_word.split(':')
            words.append({'english': english_word, 'japanese': japanese_word})
        
        random.shuffle(words)
        
        if count <= 25:
            while len(words) < 25:
                words.append("")
            
            return render(request, 'generated_sample25.html', {
                'words': words,
                'selected_text': text,
                'start_range': start_range,
                'end_range': end_range,
                'question_count': count,
            })
        else:
            while len(words) < 50:
                words.append("")
            words_first_half = words[:25]
            words_second_half = words[25:]
            number_first_half = [i for i in range(1, 26)]
            number_secound_half = [i for i in range(26, 51)]
            return render(request, 'generated_sample50.html', {
                'words_first_half': words_first_half,
                'words_second_half': words_second_half,
                'number_first_half': number_first_half,
                'number_secound_half': number_secound_half,
                'amount_count': count,
                'selected_text': text,
                'start_range': start_range,
                'end_range': end_range,
            })

def generate_sentences(request):
    """
    文を生成するページ 
    gemini flash 1.5のAPIを使用して文を生成する。 
    """
    if request.method == 'POST':
        # フォームから情報を取得 
        text_id = request.POST.get('mySelect')
        start_range = int(request.POST.get('startNumber'))
        end_range = int(request.POST.get('endNumber'))
        
        text = Text.objects.get(id=text_id).name

        # 範囲の設定
        ids = random.sample(range(start_range, end_range + 1), DEFAULT_COUNT)
        words = list(NoUnitWord.objects.filter(text_id=text_id, no__in=ids))
        phrase = prompt.ai_prompt(words, DEFAULT_COUNT)
        options = words.copy()
        random.shuffle(options)

        return render(request, 'sentence_result.html',{
                'fill_in_the_blank': phrase,
                'text' : text,
                'start_number': start_range,
                'end_number': end_range,
                'options': options,
        })
