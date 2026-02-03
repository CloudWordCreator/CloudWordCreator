from django.urls import path
from . import views

urlpatterns = [
    path('upload_csv/', views.upload_csv, name='upload_csv'),
    path('download_csv/<int:text_id>/', views.download_csv, name='download_csv'),
    path('success/', views.success, name='success'),
]