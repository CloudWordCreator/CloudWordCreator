from .models import YourModel

def extract_data(start_date, end_date):
    return YourModel.objects.filter(date__range=[start_date, end_date])