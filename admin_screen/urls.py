from django.urls import path
from . import views

urlpatterns = [
    path('eisai_admin/', views.admin, name='admin'),
    path('eisai_admin/edit_text/', views.edit_text, name='edit_text'),
    path('eisai_admin/search_text/', views.search_text, name='search_text'),
    path('eisai_admin/search_word/', views.search_word, name='search_word'),
    path('eisai_admin/edit_word/', views.edit_word, name='edit_word'),
    path('eisai_admin/delete_word/', views.delete_word, name='delete_word'),
    path('eisai_admin/delete_text/', views.delete_text, name='delete_text'),
    path('eisai_admin/save_word/', views.save_word, name='save_word'),
    path('eisai_admin/manage_units/', views.manage_units, name='manage_units'),
    path('eisai_admin/edit_unit/', views.edit_unit, name='edit_unit'),
    path('eisai_admin/save_unit/', views.save_unit, name='save_unit'),
 ]