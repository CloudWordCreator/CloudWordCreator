from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from .csv_importer import import_csv

def upload_csv(request):
    if request.method == 'POST' and request.FILES['csv_file']:
        csv_file = request.FILES['csv_file']
        csv_type = request.POST.get('csv_type')
        text_name = csv_file.name.rsplit('.', 1)[0]
        fs = FileSystemStorage()
        filename = fs.save(csv_file.name, csv_file)
        file_path = fs.path(filename)
        import_csv(file_path, csv_type, text_name)
        return redirect('success')
    return render(request, 'set.html')

def success(request):
    return render(request, 'success.html')