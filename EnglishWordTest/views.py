from django.shortcuts import render
from .models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2
import random

def index(request):
    return render(request, 'index.html')

def search(request):
    query = request.GET.get('q')
    results = []
    if query:
        results.extend([{'text': '中学英単語1000', 'data': obj} for obj in JuniorHighEnglish1000.objects.filter(word__icontains=query) | JuniorHighEnglish1000.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'システム英単語', 'data': obj} for obj in SystemEnglish.objects.filter(word__icontains=query) | SystemEnglish.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'ターゲット1900', 'data': obj} for obj in Target1900.objects.filter(word__icontains=query) | Target1900.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'でる順5級', 'data': obj} for obj in DeruJun5.objects.filter(word__icontains=query) | DeruJun5.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'でる順4級', 'data': obj} for obj in DeruJun4.objects.filter(word__icontains=query) | DeruJun4.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'でる順3級', 'data': obj} for obj in DeruJun3.objects.filter(word__icontains=query) | DeruJun3.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'でる順準2級', 'data': obj} for obj in DeruJunPre2.objects.filter(word__icontains=query) | DeruJunPre2.objects.filter(meaning__icontains=query)])
        results.extend([{'text': 'でる順2級', 'data': obj} for obj in DeruJun2.objects.filter(word__icontains=query) | DeruJun2.objects.filter(meaning__icontains=query)])
    return render(request, 'search_results.html', {'results': results})

def generate_words(request):
    if request.method == 'POST':
        text = request.POST.get('mySelect')
        start = int(request.POST.get('startNumber'))
        end = int(request.POST.get('endNumber'))
        question_count = request.POST.get('questionCount')
        mandatory_words = request.POST.getlist('mandatoryWords[]')

        # デフォルトの問題数
        default_counts = {
            'option1': 25,
            'option2': 25,
            'option3': 25,
            'option4': 25,
            'option5': 25,
            'option6': 25,
            'option7': 25,
            'option8': 25
        }

        # 高度なオプションで指定された場合はその値を使用
        count = int(question_count) if question_count else default_counts.get(text, 25)
        count -= len(mandatory_words)
        # テキストに対応するモデルを選択
        model_map = {
            'option1': JuniorHighEnglish1000,
            'option2': SystemEnglish,
            'option3': Target1900,
            'option4': DeruJun5,
            'option5': DeruJun4,
            'option6': DeruJun3,
            'option7': DeruJunPre2,
            'option8': DeruJun2
        }
        # テキストを日本語に変換
        text_map = {
            'option1': '中学英単語1000',
            'option2': 'システム英単語',
            'option3': 'ターゲット1900',
            'option4': 'でる順5級',
            'option5': 'でる順4級',
            'option6': 'でる順3級',
            'option7': 'でる順準2級',
            'option8': 'でる順2級'
        }

        model = model_map.get(text)
        selected_text_jp = text_map.get(text)

        if model:
            # 指定された範囲の数を取得
            range_size = end - start + 1

            # 問題数が範囲の数を超えている場合、範囲の数に合わせる
            if count > range_size:
                count = range_size

            # 指定された範囲からランダムにIDを選択
            ids = random.sample(range(start, end + 1), count)
            words = list(model.objects.filter(id__in=ids))

            for mandatory_word in mandatory_words:
                english_word, japanese_meaning = mandatory_word.split(':')
                words.append({'word': english_word, 'meaning': japanese_meaning})

                random.shuffle(words)

            if count <= 25:
                while len(words) < 25:
                    # 残りの空白を埋める。
                    words.append("")
                return render(request, 'generated_words1.html', {
                    'words': words,
                    'selected_text': selected_text_jp,
                    'start_range': start,
                    'end_range': end,
                    'question_count': count
                })
            else:
                while len(words) < 50:
                    # 残りの空白を埋める。
                    words.append("")
                words_first_half = words[:25]
                words_second_half = words[25:]
                number_first_half = [i for i in range(1, 26)]
                number_secound_half = [i for i in range(26, 51)]
                return render(request, 'generated_words2.html', {
                    'words_first_half': words_first_half,
                    'words_second_half': words_second_half,
                    'number_first_half': number_first_half,
                    'number_secound_half': number_secound_half,
                    'amount_count': count,
                    'selected_text': selected_text_jp,
                    'start_range': start,
                    'end_range': end,
                })

    return render(request, 'index.html')