from django.shortcuts import render
from csvManager.models import NoUnitWord

# デフォルトの問題数 
DEFAULT_COUNTS = 25

# Create your views here.
def settings(request):
    """
    情報を入力するページ 
    """
    return render(request, 'setting.html')

def search(request):
    """
    英単語(Unit構造でない)を検索するページ 
    テキスト事の検索と全ての検索付けて、日本語英語の検索に対応させる 
    """
    query = request.GET.get('q')
    results = []
    if query:
        pass

def generate_words(request):
    """
    単語を生成するページ 
    """
    pass

def generate_sentences(request):
    """
    文を生成するページ 
    gemini flash 1.5のAPIを使用して文を生成する。 
    """
    pass