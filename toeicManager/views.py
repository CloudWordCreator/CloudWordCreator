from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_list_or_404
from django.shortcuts import get_list_or_404, render
from django.shortcuts import get_list_or_404, render
from .models import ToeicWord
import json
import os
from django.conf import settings
from .csv_importer import import_toeic_csv

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
    from .models import ToeicMaterial
    
    # Get distinct scores
    scores = ToeicWord.objects.values_list('score', flat=True).distinct().order_by('score')
    
    # Get materials
    materials = list(ToeicMaterial.objects.values('id', 'name'))

    # Get range info (min/max no)
    first_word = ToeicWord.objects.order_by('no').first()
    last_word = ToeicWord.objects.order_by('no').last()
    
    data = {
        'scores': list(scores),
        'materials': materials,
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
    - material: id (optional) - if provided, filter by material
    """
    start = request.GET.get('start')
    end = request.GET.get('end')
    score = request.GET.get('score')
    material_id = request.GET.get('material')
    
    queryset = ToeicWord.objects.all().order_by('no')
    
    if material_id and material_id != 'all':
        queryset = queryset.filter(material_id=material_id)
    
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
            'id': w.id,
            'material': w.material.name if w.material else None
        })
        
    return JsonResponse({'words': words})

@login_required
@user_passes_test(is_toeic_user)
def save_word(request):
    # Logic needs to support linking material if needed, but for now simple edit
    # Assume we don't change material via individual edit yet or pass it if extended
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
        
        # Link material
        material_id = data.get('material_id')
        if material_id:
            word.material_id = int(material_id)
        elif not word.id and not material_id:
            # If new word and no material spec, default to None or handle error?
            word.material = None
            
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

@login_required
@user_passes_test(is_toeic_user)
def upload_csv(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file uploaded'}, status=400)
        
    file = request.FILES['file']
    material_name = request.POST.get('material_name') # Get material name
    
    if not file.name.endswith('.csv'):
        return JsonResponse({'error': 'File must be a CSV'}, status=400)
        
    try:
        # Save file
        save_path = os.path.join(settings.CSV_UPLOAD_DIR, file.name)
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
                
        # Import
        count = import_toeic_csv(save_path, material_name=material_name)
        
        return JsonResponse({'success': True, 'count': count})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
