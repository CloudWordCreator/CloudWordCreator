from django.urls import path
from . import views

urlpatterns = [
    path('fill-blank/', views.generate_fill_in_the_blank ,name='generate_fill_in_the_blank'),
]