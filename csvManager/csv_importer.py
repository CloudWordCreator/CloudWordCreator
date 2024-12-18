import csv
from .models import Text, Unit, UnitWord, NoUnitWord

def import_csv(file_path, text_name):
    text, created = Text.objects.get_or_create(name=text_name)
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        if 'unit' in reader.fieldnames:
            units = {}
            for row in reader:
                parent_unit_name = row['unit']
                unit_name = row['subunit']
                if parent_unit_name not in units:
                    parent_unit, created = Unit.objects.get_or_create(text=text, name=parent_unit_name, parent=None)
                    units[parent_unit_name] = parent_unit
                else:
                    parent_unit = units[parent_unit_name]

                unit, created = Unit.objects.get_or_create(text=text, name=unit_name, parent=parent_unit)
                units[unit_name] = unit

                UnitWord.objects.create(
                    unit=unit,
                    no=row['No'],
                    english=row['英語'],
                    japanese=row['日本語']
                )
        else:
            for row in reader:
                NoUnitWord.objects.create(
                    text=text,
                    no=row['No'],
                    english=row['英語'],
                    japanese=row['日本語']
                )