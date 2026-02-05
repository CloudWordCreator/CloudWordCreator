import csv
import chardet
from .models import ToeicWord

def import_toeic_csv(file_path):
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

            created_count = 0
            for row in reader:
                ToeicWord.objects.create(
                    no=int(row[mapped_headers['no']]),
                    score=int(row[mapped_headers['score']]),
                    phrase=row[mapped_headers['phrase']],
                    phrase_jp=row[mapped_headers['phrase_jp']],
                    english=row[mapped_headers['english']],
                    japanese=row[mapped_headers['japanese']]
                )
                created_count += 1
                
            return created_count

    except Exception as e:
        raise ValueError(f"Error importing CSV: {str(e)}")
