from django.shortcuts import render
from .models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2

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
