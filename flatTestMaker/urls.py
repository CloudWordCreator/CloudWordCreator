from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.settings, name='settings'),
    path('search/', views.search, name='search'),
    path('generate/words', views.generate_words, name='generate_words'),
    path('generate/sentences/', views.generate_sentences, name='generate_sentences'),
]