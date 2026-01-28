from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.settings, name='settings'),
    path('api/get_settings/', views.api_get_settings, name='api_get_settings'),
    path('search/', views.search, name='search'),
    path('api/generate/words/', views.api_generate_words, name='api_generate_words'),
    path('api/generate/sentences/', views.api_generate_sentences, name='api_generate_sentences'),
    path('result/', views.settings, name='result'), # Serve React app
]