from django.contrib import admin
from .models import Text, Unit, UnitWord

class UnitInline(admin.TabularInline):
    model = Unit
    extra = 1

class TextAdmin(admin.ModelAdmin):
    inlines = [UnitInline]

class UnitWordInline(admin.TabularInline):
    model = UnitWord
    extra = 1

class UnitAdmin(admin.ModelAdmin):
    inlines = [UnitWordInline]

admin.site.register(Text, TextAdmin)
admin.site.register(Unit, UnitAdmin)
admin.site.register(UnitWord)