import csv
from .models import Text, Unit, UnitWord

def import_csv(file_path, csv_type, text_name):
    text, created = Text.objects.get_or_create(name=text_name)
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        if csv_type == 'unit':
            for row in reader:
                unit_name = row['unit']
                unit, created = Unit.objects.get_or_create(text=text, name=unit_name)
                UnitWord.objects.create(
                    unit=unit,
                    no=row['No'],
                    english=row['英語'],
                    japanese=row['日本語']
                )
        elif csv_type == 'word':
            unit, created = Unit.objects.get_or_create(text=text, name='default')
            for row in reader:
                UnitWord.objects.create(
                    unit=unit,
                    no=row['No'],
                    english=row['英語'],
                    japanese=row['日本語']
                )