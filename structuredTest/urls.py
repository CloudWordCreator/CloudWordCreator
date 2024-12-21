from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.display_data, name='display_data'),
]
