from django.urls import path
from . import views

urlpatterns = [
    path('eisai_admin/', views.admin, name='admin'),
    path('eisai_admin/edit_text/', views.edit_text, name='edit_text'),
    path('eisai_admin/search_text/', views.search_text, name='search_text'),
    path('eisai_admin/search_word/', views.search_word, name='search_word'),
 ]