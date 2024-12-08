from django.contrib import admin
from .models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2

class EnglishWordAdmin(admin.ModelAdmin):
    list_display = ('id', 'word', 'meaning')

admin.site.register(JuniorHighEnglish1000, EnglishWordAdmin)
admin.site.register(SystemEnglish, EnglishWordAdmin)
admin.site.register(Target1900, EnglishWordAdmin)
admin.site.register(DeruJun5, EnglishWordAdmin)
admin.site.register(DeruJun4, EnglishWordAdmin)
admin.site.register(DeruJun3, EnglishWordAdmin)
admin.site.register(DeruJunPre2, EnglishWordAdmin)
admin.site.register(DeruJun2, EnglishWordAdmin)
