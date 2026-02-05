import csv
import chardet
from .models import ToeicWord, ToeicMaterial

def import_toeic_csv(file_path, material_name=None):
    """
    Imports TOEIC words from a CSV file.
    Expected CSV columns: No, score, phrase, pharseJP (or phraseJP), 英語, 日本語
    """
    # Detect encoding
    with open(file_path, 'rb') as rawfile:
        result = chardet.detect(rawfile.read())
        encoding = result['encoding']

    try:
        with open(file_path, newline='', encoding=encoding) as csvfile:
            reader = csv.DictReader(csvfile)
            
            # Normalize headers for typo handling (pharseJP vs phraseJP)
            # We will use keys from the reader.fieldnames to find the matching ones
            field_map = {
                'no': ['No', 'no'],
                'score': ['score', 'Score'],
                'phrase': ['phrase', 'Phrase'],
                'phrase_jp': ['phraseJP', 'pharseJP', 'PhraseJP', 'PharseJP'],
                'english': ['英語', 'English'],
                'japanese': ['日本語', 'Japanese']
            }
            
            # Helper to find key
            def get_key(row_keys, potential_keys):
                for pk in potential_keys:
                    if pk in row_keys:
                        return pk
                return None

            headers = reader.fieldnames
            
            # Check if required columns exist
            mapped_headers = {}
            for field, candidates in field_map.items():
                found_key = get_key(headers, candidates)
                if not found_key:
                    raise ValueError(f"Missing column for '{field}'. Expected one of: {candidates}")
                mapped_headers[field] = found_key

            # Retrieve or Create Material
            material = None
            if material_name:
                material, created = ToeicMaterial.objects.get_or_create(name=material_name)

            created_count = 0
            for i, row in enumerate(reader, start=1):
                # Helper to safely get value and ensure it's not None
                def get_val(key):
                    val = row.get(mapped_headers[key])
                    return val if val is not None else ''

                # Validate essential fields
                japanese_val = get_val('japanese')
                english_val = get_val('english')
                
                if not japanese_val:
                    if row.get(mapped_headers['japanese']) is None:
                         raise ValueError(f"Line {i}: Missing value for 'Japanese'. Check for missing commas.")

                ToeicWord.objects.create(
                    material=material,
                    no=int(get_val('no') or 0),
                    score=int(get_val('score') or 0),
                    phrase=get_val('phrase'),
                    phrase_jp=get_val('phrase_jp'),
                    english=english_val,
                    japanese=japanese_val
                )
                created_count += 1
                
            return created_count

    except Exception as e:
        raise ValueError(f"Error importing CSV: {str(e)}")
