from django.shortcuts import render, redirect
import random
from csvManager.models import UnitWord, NoUnitWord, Text
from .models import Announcement
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q
import json
import logging

logger = logging.getLogger(__name__)

# Create your views here.

@ensure_csrf_cookie
def home(request):
    """
    Home画面 (React)
    """
    return render(request, 'home_react_base.html')

def api_get_home_data(request):
    try:
        unit_words = UnitWord.objects.select_related('unit__text').all()
        no_unit_words = NoUnitWord.objects.select_related('text').all()

        flat_test_texts = list(set(nuw.text.name for nuw in no_unit_words))
        structured_test_texts = list(set(uw.unit.text.name for uw in unit_words))

        flat_test_texts_sample = random.sample(flat_test_texts, min(2, len(flat_test_texts))) if flat_test_texts else []
        structured_test_texts_sample = random.sample(structured_test_texts, min(2, len(structured_test_texts))) if structured_test_texts else []

        return JsonResponse({
            'flat_test_texts': flat_test_texts_sample,
            'structured_test_texts': structured_test_texts_sample,
            'all_texts': list(Text.objects.values('id', 'name').order_by('name'))
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def api_global_search(request):
    query = request.GET.get('q', '')
    text_id = request.GET.get('text_id')

    if not query:
        return JsonResponse({'results': []})
    
    results = []
    
    # UnitWord search
    unit_words_query = UnitWord.objects.filter(
        Q(english__icontains=query) | Q(japanese__icontains=query)
    )
    if text_id:
        unit_words_query = unit_words_query.filter(unit__text_id=text_id)
        
    unit_words = unit_words_query.select_related('unit__text')[:10]

    for word in unit_words:
        results.append({
            'english': word.english,
            'japanese': word.japanese,
            'source': 'Structured',
            'text': word.unit.text.name,
            'unit': word.unit.name
        })

    # NoUnitWord search
    no_unit_words_query = NoUnitWord.objects.filter(
        Q(english__icontains=query) | Q(japanese__icontains=query)
    )
    if text_id:
        no_unit_words_query = no_unit_words_query.filter(text_id=text_id)

    no_unit_words = no_unit_words_query.select_related('text')[:10]

    for word in no_unit_words:
        results.append({
            'english': word.english,
            'japanese': word.japanese,
            'source': 'Flat',
            'text': word.text.name,
            'unit': None
        })
    
    return JsonResponse({'results': results})

@ensure_csrf_cookie
def report(request):
    """
    Report画面 (React)
    """
    return render(request, 'home_react_base.html')

def api_submit_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            school_name = data.get('school_name')
            material = data.get('material')
            details = data.get('details')

            report_message = f"""
                # Report Received
                **School Name**: {school_name}
                **Material**: {material}
                **Details**:
                {details}
            """
            
            # Log to Discord via configured logger
            logger.info(report_message)
            return JsonResponse({'success': True})
        except Exception as e:
            logger.error(f"Failed to submit report: {e}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'POST required'}, status=400)



def api_get_announcements(request):
    try:
        announcements = Announcement.objects.filter(is_active=True)[:10]
        data = []
        for a in announcements:
            data.append({
                'id': a.id,
                'title': a.title,
                'content': a.content,
                'category': a.category,
                'category_display': a.get_category_display(),
                'created_at': a.created_at.strftime('%Y-%m-%d'),
            })
        return JsonResponse({'announcements': data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
