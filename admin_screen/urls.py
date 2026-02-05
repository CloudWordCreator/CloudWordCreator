from django.urls import path
from . import views

urlpatterns = [
    path('eisai_admin/', views.admin, name='admin'),
    path('eisai_admin/edit_text/', views.edit_text, name='edit_text'),
    path('eisai_admin/api/delete_text/', views.api_delete_text, name='api_delete_text'),
    path('eisai_admin/api/search_text/', views.api_search_text, name='api_search_text'),
    path('eisai_admin/api/init_data/', views.api_get_admin_data, name='api_get_admin_data'),

    # APIs
    path('eisai_admin/api/text_details/', views.api_get_text_details, name='api_get_text_details'),
    path('eisai_admin/api/save_word/', views.api_save_word, name='api_save_word'),
    path('eisai_admin/api/delete_word/', views.api_delete_word, name='api_delete_word'),
    path('eisai_admin/api/save_unit/', views.api_save_unit, name='api_save_unit'),
    path('eisai_admin/api/delete_unit/', views.api_delete_unit, name='api_delete_unit'),
    path('eisai_admin/api/get_announcements/', views.api_get_all_announcements, name='api_get_all_announcements'),
    path('eisai_admin/api/save_announcement/', views.api_save_announcement, name='api_save_announcement'),
    path('eisai_admin/api/delete_announcement/', views.api_delete_announcement, name='api_delete_announcement'),
 ]