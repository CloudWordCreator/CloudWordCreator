from django.contrib import admin
from .models import Text, Unit, UnitWord, NoUnitWord

class UnitInline(admin.TabularInline):
    model = Unit
    extra = 1

class UnitWordInline(admin.TabularInline):
    model = UnitWord
    extra = 1

class NoUnitWordInline(admin.TabularInline):
    model = NoUnitWord
    extra = 1

class TextAdmin(admin.ModelAdmin):
    inlines = [UnitInline, NoUnitWordInline]

class UnitAdmin(admin.ModelAdmin):
    inlines = [UnitWordInline]
    list_display = ('name', 'text', 'parent', 'child_units')

    def child_units(self, obj):
        return ", ".join([child.name for child in obj.subunits.all()])
    child_units.short_description = '子ユニット'

admin.site.register(Text, TextAdmin)
admin.site.register(Unit, UnitAdmin)
admin.site.register(UnitWord)
admin.site.register(NoUnitWord)