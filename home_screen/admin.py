from django.contrib import admin
from .models import Announcement

# Register your models here.

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'content')
