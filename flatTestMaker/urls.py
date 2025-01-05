from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.settings, name='settings'),
    path('search/', views.search, name='search'),
    path('generate/', views.generate, name='generate'),
    path('generate/sentences/', views.generate_sentences, name='generate_sentences'),
]