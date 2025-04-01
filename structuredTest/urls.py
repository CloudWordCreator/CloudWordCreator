from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.display_data, name='display_data'),
    path('create_test/', views.create_test, name='create_test'),
]
