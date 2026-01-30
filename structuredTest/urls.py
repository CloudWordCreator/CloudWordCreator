from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.display_data, name='settings'), # Base React App
    path('api/get_settings/', views.api_get_structured_settings, name='api_get_structured_settings'),
    path('api/create_test/', views.api_create_structured_test, name='api_create_structured_test'),
    path('result/', views.display_data, name='structured_test_result'), # Re-use base view for React routing
]
