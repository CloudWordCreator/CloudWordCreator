from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/get_home_data/', views.api_get_home_data, name='api_get_home_data'),
    path('api/global_search/', views.api_global_search, name='api_global_search'),
    path('report/', views.report, name='report'),
    path('api/submit_report/', views.api_submit_report, name='api_submit_report'),
    path('submit_report/', views.submit_report, name='submit_report'),
    path('api/get_announcements/', views.api_get_announcements, name='api_get_announcements'),
]