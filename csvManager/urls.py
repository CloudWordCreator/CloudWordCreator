from django.urls import path
from . import views

urlpatterns = [
    path('upload_csv/', views.upload_csv, name='upload_csv'),
    path('success/', views.success, name='success'),
    path('display_data/', views.display_data, name='display_data'),
    path('display_data_none_unit/', views.display_data_none_unit, name='display_data_none_unit'),
]