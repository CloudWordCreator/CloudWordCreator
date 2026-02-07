from django.urls import path
from . import views
from home_screen import views as home_views

urlpatterns = [
    path('api/settings/', views.get_settings, name='get_settings'),
    path('api/words/', views.get_words, name='get_words'),
    path('api/save_word/', views.save_word, name='save_word'),
    path('api/delete_word/', views.delete_word, name='delete_word'),
    path('api/upload_csv/', views.upload_csv, name='upload_csv'),
    path('api/delete_material/', views.delete_material, name='delete_material'),
    path('api/generate_test/', views.generate_test, name='generate_test'),
    # Frontend Routes
    path('', views.toeic_frontend, name='toeic_home'),
    path('settings/', views.toeic_frontend, name='toeic_settings'),
    path('result/', views.toeic_frontend, name='toeic_result'),
]
