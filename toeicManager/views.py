from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_list_or_404
from django.shortcuts import get_list_or_404, render
from django.shortcuts import get_list_or_404, render
from .models import ToeicWord
import json

def is_toeic_user(user):
    return user.groups.filter(name='toeic_users').exists() or user.is_superuser

@login_required(login_url='/login/')
@user_passes_test(is_toeic_user)
def toeic_frontend(request):
    """
    Protected view for React Frontend (TOEIC screens)
    """
    return render(request, 'home_react_base.html')

@login_required(login_url='/login/')
@user_passes_test(is_toeic_user)
def toeic_frontend(request):
    """
    Protected view for React Frontend (TOEIC screens)
    """
    return render(request, 'home_react_base.html')

@login_required
@user_passes_test(is_toeic_user)
def get_settings(request):
    """
    Returns available scores/categories and total counts.
    """
    # Get distinct scores
    scores = ToeicWord.objects.values_list('score', flat=True).distinct().order_by('score')
    
    # Get range info (min/max no)
    first_word = ToeicWord.objects.order_by('no').first()
    last_word = ToeicWord.objects.order_by('no').last()
    
    data = {
        'scores': list(scores),
        'range': {
            'min': first_word.no if first_word else 0,
            'max': last_word.no if last_word else 0
        },
        'count': ToeicWord.objects.count()
    }
    return JsonResponse(data)

@login_required
@user_passes_test(is_toeic_user)
def get_words(request):
    """
    Fetch words based on criteria.
    Query Params:
    - start: int (optional)
    - end: int (optional)
    - score: int (optional) - if provided, filter by specific score
    """
    start = request.GET.get('start')
    end = request.GET.get('end')
    score = request.GET.get('score')
    
    queryset = ToeicWord.objects.all().order_by('no')
    
    if score:
        queryset = queryset.filter(score=score)
        
    if start and end:
        try:
            queryset = queryset.filter(no__gte=int(start), no__lte=int(end))
        except ValueError:
            return JsonResponse({'error': 'Invalid range parameters'}, status=400)

    words = []
    for w in queryset:
        words.append({
            'no': w.no,
            'score': w.score,
            'english': w.english,
            'japanese': w.japanese,
            'phrase': w.phrase,
            'phrase_jp': w.phrase_jp,
            # Add implicit ID if needed for frontend key
            'id': w.id
        })
        
    return JsonResponse({'words': words})

@login_required
@user_passes_test(is_toeic_user)
def save_word(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        if data.get('id'):
            word = ToeicWord.objects.get(id=data.get('id'))
        else:
            word = ToeicWord()
        
        word.no = int(data.get('no'))
        word.score = int(data.get('score'))
        word.english = data.get('english')
        word.japanese = data.get('japanese')
        word.phrase = data.get('phrase', '')
        word.phrase_jp = data.get('phrase_jp', '')
        word.save()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@user_passes_test(is_toeic_user)
def delete_word(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        ToeicWord.objects.get(id=data.get('id')).delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
