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
class EditTextView(LoginRequiredMixin, TemplateView):
    # summary
    # ログイン要の設定
    template_name = 'admin_screen/edit_text.html'
    login_url = '/login/'  # ログインURL指定
    redirect_field_name = 'redirect_to'  # ログイン後のリダイレクト先

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

# テキストを検索
@login_required(login_url='/login/')
def search_text(request):
    query = request.GET.get('text_query')
    results = []
    if query:
        results = Text.objects.filter(models.Q(name__icontains=query))
    return render(request, 'text_result.html', {'results': results})

# 単語を検索する
@login_required(login_url='/login/')
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
            ).values('id', 'english', 'japanese', 'no', 'unit__text__name')

            # NoUnitWord（ユニット外の単語）を検索（英語または日本語で部分一致）
            no_unit_word_results = NoUnitWord.objects.filter(
                text=text
            ).filter(
                Q(english__icontains=query) | Q(japanese__icontains=query)  # 英語または日本語で検索
            ).values('id', 'english', 'japanese', 'no', 'text__name')

            # 結果の統合
            results = list(unit_word_results) + list(no_unit_word_results)

        except Text.DoesNotExist:
            return JsonResponse({'results': [], 'error': '指定された教材が見つかりません'})

    elif not text_id:
        return JsonResponse({'results': [], 'error': '教材IDが指定されていません'})

    # JSON形式で結果を返す
    return JsonResponse({'results': results})

# 単語を編集する
@login_required(login_url='/login/')
def edit_word(request):
    # URLパラメータから単語IDを取得
    word_id = request.GET.get('word_id')  # 単語のID

    # 単語を取得（UnitWord または NoUnitWord を考慮）
    word = None
    try:
        if UnitWord.objects.filter(id=word_id).exists():
            word = UnitWord.objects.get(id=word_id)  # UnitWord から取得
        elif NoUnitWord.objects.filter(id=word_id).exists():
            word = NoUnitWord.objects.get(id=word_id)  # NoUnitWord から取得
        else:
            pass
            # return render(request, 'error.html', {'message': '指定された単語が見つかりませんでした。'})
    except Exception as e:
        return print(e)

    # 単語情報をテンプレートに渡す
    return render(request, 'edit_word.html', {
        'word': word,
        'text' : word.unit.text if isinstance(word, UnitWord) else word.text
    })

# 単語を削除する
@login_required(login_url='/login/')
def delete_word(request):
    word_id = request.GET.get('word_id')  # 削除対象の単語IDを取得

    if not word_id:  # `word_id` が指定されていない場合の処理
        return JsonResponse({'error': '単語IDが指定されていません。'}, status=400)

    try:
        # `UnitWord` または `NoUnitWord` で削除処理を実行
        if UnitWord.objects.filter(id=word_id).exists():
            word = UnitWord.objects.get(id=word_id)  # UnitWord
        elif NoUnitWord.objects.filter(id=word_id).exists():
            word = NoUnitWord.objects.get(id=word_id)  # NoUnitWord
        else:
            return JsonResponse({'error': '単語が見つかりませんでした。'}, status=404)

        # 単語を削除
        word.delete()

        # 成功時のJSONレスポンス
        return JsonResponse({'message': '単語が正常に削除されました。'})

    except Exception as e:
        # 予期しないエラー時のエラーレスポンス
        return JsonResponse({'error': f'サーバーエラー: {str(e)}'}, status=500)

# 単語を上書き保存する
@login_required(login_url='/login/')
def save_word(request):
    if request.method == 'POST':  # POSTリクエストを確認
        word_id = request.POST.get('word_id')  # フォームから単語IDを取得
        no = request.POST.get('no')  # Noを取得
        english = request.POST.get('english')  # 英語単語を取得
        japanese = request.POST.get('japanese')  # 日本語単語を取得

        try:
            # `UnitWord` または `NoUnitWord` に一致する単語を取得
            if UnitWord.objects.filter(id=word_id).exists():
                word = UnitWord.objects.get(id=word_id)  # UnitWord から取得
            elif NoUnitWord.objects.filter(id=word_id).exists():
                word = NoUnitWord.objects.get(id=word_id)  # NoUnitWord から取得
            else:
                return JsonResponse({'error': '単語が見つかりませんでした。'}, status=404)

            # データを更新
            word.no = no
            word.english = english
            word.japanese = japanese
            word.save()  # データベースに保存

            # 編集完了後のリダイレクト（再ロードを防ぐため）
            if isinstance(word, UnitWord):
                text_id = word.unit.text.id  # UnitWord の text ID を取得
            else:
                text_id = word.text.id  # NoUnitWord の text ID を取得

            url = reverse('edit_text')  # Named URLを取得
            return HttpResponseRedirect(f'{url}?text-id={int(text_id)}')

        except Exception as e:
            # エラーハンドリング
            return JsonResponse({'error': f'サーバーエラー: {str(e)}'}, status=500)

    # POST以外のリクエストはエラーを返す
    return JsonResponse({'error': 'POSTリクエストを受け付けていません。'}, status=400)

@login_required(login_url='/login/')
def delete_text(request):
    text_id = request.GET.get('text_id')
    del_text = Text.objects.get(id=text_id)
    del_text.delete()
    return render(request, 'delete success.html', {'delText': del_text})

# Unit management
@login_required(login_url='/login/')
def manage_units(request):
    text_id = request.GET.get('text_id')
    text = get_object_or_404(Text, id=text_id)
    units = Unit.objects.filter(text=text)
    return render(request, 'manage_units.html', {'text': text, 'units': units})

@login_required(login_url='/login/')
def edit_unit(request):
    unit_id = request.GET.get('unit_id')
    unit = get_object_or_404(Unit, id=unit_id)
    return render(request, 'edit_unit.html', {'unit': unit})

@login_required(login_url='/login/')
def save_unit(request):
    if request.method == 'POST':
        unit_id = request.POST.get('unit_id')
        name = request.POST.get('name')
        
        unit = get_object_or_404(Unit, id=unit_id)
        unit.name = name
        unit.save()
        
        return redirect(f"{reverse('manage_units')}?text_id={unit.text.id}")
    return JsonResponse({'error': 'POST required'}, status=400)

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
