from django.shortcuts import render, get_object_or_404, redirect
from csvManager.models import Text, NoUnitWord, UnitWord
from django.db import models
from django.http import JsonResponse, HttpResponseRedirect
from django.db.models import Q
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

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
    return render(request, 'edit_word.html', {'word': word})

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
            url = reverse('edit_text')  # Named URLを取得
            return HttpResponseRedirect(f'{url}?text-id={int(word.text.id)}')

        except Exception as e:
            # エラーハンドリング
            return JsonResponse({'error': f'サーバーエラー: {str(e)}'}, status=500)

    # POST以外のリクエストはエラーを返す
    return JsonResponse({'error': 'POSTリクエストを受け付けていません。'}, status=400)

# 教材を削除する
@login_required(login_url='/login/')
def delete_text(request):
    text_id = request.GET.get('text_id')
    del_text = Text.objects.get(id=text_id)
    del_text.delete()
    return render(request, 'delete success.html', {'delText': del_text})