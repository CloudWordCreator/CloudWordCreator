from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

# Create your views here.
# ログイン保護するプロジェクト
# 保護対象
# admin_screen
# csvManager

"""
views.py 内の関数にデコレーターを付与する
from django.contrib.auth.decorators import login_required
@login_required(login_url='/login/')
def function():
"""

def login_view(request):
    next_url = request.GET.get('next') or request.POST.get('next')
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if next_url:
                return redirect(next_url)
            return redirect('/admin_screen/eisai_admin')  # ログイン成功後のリダイレクト先
        else:
            return render(request, 'login.html', {'error': '無効なログイン情報です', 'next': next_url})
    return render(request, 'login.html', {'next': next_url})
