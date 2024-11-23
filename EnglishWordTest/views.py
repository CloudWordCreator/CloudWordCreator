from django.shortcuts import render
from .models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2

def index(request):
    return render(request, 'index.html')

def search(request):
    query = request.GET.get('q')
    results = []
    if query:
        results.extend(JuniorHighEnglish1000.objects.filter(word__icontains=query) | JuniorHighEnglish1000.objects.filter(meaning__icontains=query))
        results.extend(SystemEnglish.objects.filter(word__icontains=query) | SystemEnglish.objects.filter(meaning__icontains=query))
        results.extend(Target1900.objects.filter(word__icontains=query) | Target1900.objects.filter(meaning__icontains=query))
        results.extend(DeruJun5.objects.filter(word__icontains=query) | DeruJun5.objects.filter(meaning__icontains=query))
        results.extend(DeruJun4.objects.filter(word__icontains=query) | DeruJun4.objects.filter(meaning__icontains=query))
        results.extend(DeruJun3.objects.filter(word__icontains=query) | DeruJun3.objects.filter(meaning__icontains=query))
        results.extend(DeruJunPre2.objects.filter(word__icontains=query) | DeruJunPre2.objects.filter(meaning__icontains=query))
        results.extend(DeruJun2.objects.filter(word__icontains=query) | DeruJun2.objects.filter(meaning__icontains=query))
    return render(request, 'search_results.html', {'results': results})


