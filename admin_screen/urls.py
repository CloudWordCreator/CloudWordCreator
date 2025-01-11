from django.urls import path
from . import views

urlpatterns = [
    path('eisai_admin/', views.admin, name='admin'),
    path('eisai_admin/edit_text/', views.edit_text, name='edit_text'),
]