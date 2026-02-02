from django.shortcuts import render
from csvManager.models import Text, NoUnitWord
from django.db import models
import random
from . import ai_prompt as prompt

# デフォルトの問題数 
DEFAULT_COUNT = 25

# Create your views here.
from django.http import JsonResponse
import json

def settings(request):
    """
    Flat Test Maker (React)
    """
    return render(request, 'flat_test_react_base.html')

def api_get_settings(request):
    try:
        texts = Text.objects.filter(no_unit_words__isnull=False).distinct()
        text_data = []
        for text in texts:
             # Get min and max 'no' for this text to help frontend set default range
            words = text.no_unit_words.all()
            min_no = words.aggregate(models.Min('no'))['no__min'] or 1
            max_no = words.aggregate(models.Max('no'))['no__max'] or 100
            
            text_data.append({
                'id': text.id,
                'name': text.name,
                'count': words.count(),
                'min_no': min_no,
                'max_no': max_no
            })
            
        return JsonResponse({'texts': text_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




def api_generate_words(request):
    """
    単語生成API
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text_id = data.get('text_id')
            start_range = int(data.get('start_range'))
            end_range = int(data.get('end_range'))
            question_count = data.get('question_count')
            mandatory_words = data.get('mandatory_words', [])

            text_obj = Text.objects.get(id=text_id)
            text_name = text_obj.name

            # default logic
            count = int(question_count) if question_count else DEFAULT_COUNT
            count -= len(mandatory_words)
            
            range_size = end_range - start_range + 1
            if count > range_size:
                count = range_size
            
            # Avoid error if range is invalid or empty
            if range_size <= 0:
                available_ids = []
            else:
                available_ids = list(range(start_range, end_range + 1))
            
            ids = random.sample(available_ids, min(len(available_ids), count))
            words_qs = NoUnitWord.objects.filter(text_id=text_id, no__in=ids)
            
            words_list = []
            for w in words_qs:
                words_list.append({
                    'english': w.english,
                    'japanese': w.japanese,
                    'no': w.no # useful for sorting if needed
                })

            for m_word in mandatory_words:
                if ':' in m_word:
                    eng, jp = m_word.split(':')
                    words_list.append({'english': eng, 'japanese': jp})
            
            random.shuffle(words_list)
            
            # Padding for print layout consistency
            target_len = 50 if len(words_list) > 25 else 25
            while len(words_list) < target_len:
                 words_list.append({'english': '', 'japanese': ''})

            return JsonResponse({
                'words': words_list,
                'selected_text': text_name,
                'start_range': start_range,
                'end_range': end_range,
                'amount_count': len(words_list) # logical count (before padding?) or just used for display
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST method required'}, status=400)



def api_generate_sentences(request):
    """
    文生成API
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text_id = data.get('text_id')
            start_range = int(data.get('start_range'))
            end_range = int(data.get('end_range'))
            # question_count logic if needed, but previously fixed to DEFAULT_COUNT (25?)

            text_obj = Text.objects.get(id=text_id)
            text_name = text_obj.name

            # 範囲の設定
            available_ids = list(range(start_range, end_range + 1))
            # Safety check
            if not available_ids:
                return JsonResponse({'error': 'Invalid range'}, status=400)
                
            ids = random.sample(available_ids, min(len(available_ids), DEFAULT_COUNT))
            words_qs = list(NoUnitWord.objects.filter(text_id=text_id, no__in=ids))
            
            # Call AI Prompt
            # Warning: prompt.ai_prompt expects objects with .english, .japanese
            # It returns a list of dicts (or objects?) - let's assume dicts based on context
            phrase_data = prompt.ai_prompt(words_qs, DEFAULT_COUNT)
            
            # Serialize words_qs for options
            options_list = []
            for w in words_qs:
                options_list.append({
                    'english': w.english,
                    'japanese': w.japanese
                })
            random.shuffle(options_list)

            return JsonResponse({
                'fill_in_the_blank': phrase_data, # Assuming this is JSON serializable
                'text': text_name,
                'start_number': start_range,
                'end_number': end_range,
                'options': options_list
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST method required'}, status=400)
