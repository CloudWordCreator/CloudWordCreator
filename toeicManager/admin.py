from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django import forms
from .models import ToeicWord
from .csv_importer import import_toeic_csv

class CsvImportForm(forms.Form):
    csv_file = forms.FileField()

@admin.register(ToeicWord)
class ToeicWordAdmin(admin.ModelAdmin):
    list_display = ('no', 'english', 'japanese', 'score', 'material')
    list_filter = ('score', 'material')
    search_fields = ('english', 'japanese', 'phrase')

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),
        ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]
            import os
            from django.conf import settings
            
            save_path = os.path.join(settings.CSV_UPLOAD_DIR, 'temp_toeic_upload.csv')
            
            with open(save_path, 'wb+') as destination:
                for chunk in csv_file.chunks():
                    destination.write(chunk)
            
            try:
                count = import_toeic_csv(save_path)
                self.message_user(request, f"Successfully imported {count} words.", level=messages.SUCCESS)
                return redirect("..")
            except Exception as e:
                self.message_user(request, f"Error: {e}", level=messages.ERROR)
                
        form = CsvImportForm()
        payload = {"form": form}
        return render(
            request, "admin/csv_form.html", payload
        )
