from django.shortcuts import render, get_object_or_404, redirect
from csvManager.models import Text, NoUnitWord, UnitWord, Unit
from home_screen.models import Announcement
from django.db import models
from django.http import JsonResponse, HttpResponseRedirect
from django.db.models import Q
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
import json

# Create your views here.
# This is the view for the admin page


# admin画面ホーム
@login_required(login_url='/login/')
def admin(request):
    # ユニットで分けられているテキストを取得
    unit_texts = Text.objects.filter(units__isnull=False).distinct()
    
    # ユニットで分けられていないテキストを取得
    no_unit_texts = Text.objects.filter(no_unit_words__isnull=False).distinct()
    
    return render(request, 'admin home.html', {'unit_texts': unit_texts, 'no_unit_texts': no_unit_texts})

# テキスト選択後の編集画面
@login_required(login_url='/login/')
# @login_required(login_url='/login/')
def edit_text(request):
    # React will handle fetching data based on URL text-id param
    return render(request, 'admin home.html')



@login_required(login_url='/login/')
def api_delete_text(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    try:
        data = json.loads(request.body)
        text_id = data.get('id')
        Text.objects.get(id=text_id).delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_search_text(request):
    """
    Search texts and return results as JSON for React frontend.
    """
    query = request.GET.get('text_query')
    results = []
    if query:
        # 検索ロジック (search_textと同様)
        texts = Text.objects.filter(models.Q(name__icontains=query))
        # JSONシリアライズ用に辞書リストへ変換
        results = [
            {'id': t.id, 'name': t.name} for t in texts
        ]
    return JsonResponse({'results': results})

# API for Admin Home React Migration
@login_required(login_url='/login/')
def api_get_admin_data(request):
    unit_texts = Text.objects.filter(units__isnull=False).distinct()
    no_unit_texts = Text.objects.filter(no_unit_words__isnull=False).distinct()
    
    data = {
        'unit_texts': [{'id': t.id, 'name': t.name} for t in unit_texts],
        'no_unit_texts': [{'id': t.id, 'name': t.name} for t in no_unit_texts]
    }
    return JsonResponse(data)

@login_required(login_url='/login/')
def api_get_text_details(request):
    text_id = request.GET.get('text_id')
    if not text_id:
        return JsonResponse({'error': 'No text_id provided'}, status=400)
    
    text = get_object_or_404(Text, id=text_id)
    
    # Units
    units = Unit.objects.filter(text=text)
    
    # Words
    unit_words = UnitWord.objects.filter(unit__text=text)
    no_unit_words = NoUnitWord.objects.filter(text=text)
    
    # Serialize
    units_data = [{'id': u.id, 'name': u.name, 'parent_id': u.parent.id if u.parent else None} for u in units]
    
    words_data = []
    for w in unit_words:
        words_data.append({
            'id': w.id,
            'no': w.no,
            'english': w.english,
            'japanese': w.japanese,
            'unit_id': w.unit.id,
            'type': 'unit'
        })
    for w in no_unit_words:
        words_data.append({
            'id': w.id,
            'no': w.no,
            'english': w.english,
            'japanese': w.japanese,
            'unit_id': None,
            'type': 'nounit'
        })
        
    # Sort words by No
    words_data.sort(key=lambda x: x['no'])

    return JsonResponse({
        'text': {'id': text.id, 'name': text.name},
        'units': units_data,
        'words': words_data
    })

@login_required(login_url='/login/')
def api_save_word(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        word_id = data.get('id')
        text_id = data.get('text_id')
        unit_id = data.get('unit_id')
        
        # Determine model and instance
        if unit_id:
            # Saving UnitWord
            unit = get_object_or_404(Unit, id=unit_id)
            if word_id:
                word = get_object_or_404(UnitWord, id=word_id)
            else:
                word = UnitWord(unit=unit)
        else:
            # Saving NoUnitWord
            text = get_object_or_404(Text, id=text_id)
            if word_id:
                word = get_object_or_404(NoUnitWord, id=word_id)
            else:
                word = NoUnitWord(text=text)

        word.no = data.get('no')
        word.english = data.get('english')
        word.japanese = data.get('japanese')
        word.save()

        return JsonResponse({'success': True, 'word': {
            'id': word.id,
            'no': word.no,
            'english': word.english,
            'japanese': word.japanese,
            'unit_id': unit_id if unit_id else None,
            'type': 'unit' if unit_id else 'nounit'
        }})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_delete_word(request):
    # Wrapper for existing delete_word or re-implementation for JSON body if preferred.
    # Re-using existing logic but expecting POST with JSON for consistency if needed, 
    # but let's stick to existing GET param style or simple POST for now.
    # Actually, let's make a clean API version.
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        word_id = data.get('id')
        word_type = data.get('type') # 'unit' or 'nounit'
        
        if word_type == 'unit':
            word = get_object_or_404(UnitWord, id=word_id)
        else:
            word = get_object_or_404(NoUnitWord, id=word_id)
            
        word.delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_save_unit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        unit_id = data.get('id')
        text_id = data.get('text_id')
        
        text = get_object_or_404(Text, id=text_id)
        
        if unit_id:
            unit = get_object_or_404(Unit, id=unit_id)
        else:
            unit = Unit(text=text)
            
        unit.name = data.get('name')
        if data.get('parent_id'):
             unit.parent = get_object_or_404(Unit, id=data.get('parent_id'))
        else:
            unit.parent = None
            
        unit.save()
        
        return JsonResponse({'success': True, 'unit': {
            'id': unit.id,
            'name': unit.name,
            'parent_id': unit.parent.id if unit.parent else None
        }})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_delete_unit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        unit_id = data.get('id')
        unit = get_object_or_404(Unit, id=unit_id)
        unit.delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Notification Management APIs
@login_required(login_url='/login/')
def api_get_all_announcements(request):
    try:
        announcements = Announcement.objects.all().order_by('-created_at')
        data = []
        for a in announcements:
            data.append({
                'id': a.id,
                'title': a.title,
                'content': a.content,
                'category': a.category,
                'is_active': a.is_active,
                'created_at': a.created_at.strftime('%Y-%m-%d %H:%M')
            })
        return JsonResponse({'announcements': data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_save_announcement(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        announcement_id = data.get('id')
        
        if announcement_id:
            announcement = get_object_or_404(Announcement, id=announcement_id)
        else:
            announcement = Announcement()
            
        announcement.title = data.get('title')
        announcement.content = data.get('content', '')
        announcement.category = data.get('category', 'INFO')
        announcement.is_active = data.get('is_active', True)
        
        announcement.save()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required(login_url='/login/')
def api_delete_announcement(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST request required'}, status=400)
    
    try:
        data = json.loads(request.body)
        announcement_id = data.get('id')
        announcement = get_object_or_404(Announcement, id=announcement_id)
        announcement.delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
