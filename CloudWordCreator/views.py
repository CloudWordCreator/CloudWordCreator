from django.shortcuts import render, redirect

def info(request):
    """
    昔使ってたURLからhome画面にリダイレクトする
    """
    return redirect('home')