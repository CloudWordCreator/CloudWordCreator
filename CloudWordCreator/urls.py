"""
URL configuration for CloudWordCreator project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('csv_set/', include('csvManager.urls')),
    path('structuredTest/', include('structuredTest.urls')),
    path('flatTestMaker/', include('flatTestMaker.urls')),
    path('admin_screen/', include('admin_screen.urls')),
    path('login/', include('authentication.urls')),
    path('home/', include('home_screen.urls')),
    path('info/', views.info, name='info'),
]
