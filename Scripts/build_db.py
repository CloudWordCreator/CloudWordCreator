import csv
import sqlite3
import os

# CSVファイルのディレクトリ
CSV_DIR = r'C:\Users\sabax\source\repos\CloudWordCreator\Scripts\csv_data'
DB_FILE = r'C:\Users\sabax\source\repos\CloudWordCreator\db.sqlite3'

conn = sqlite3.connect(DB_FILE)
cur = conn.cursor()

# CSVファイル名とテーブル名のマッピング
csv_to_table = {
    '中学英単語1000.csv': 'JuniorHighEnglish1000',
    'システム英単語.csv': 'SystemEnglish',
    'ターゲット1900.csv': 'Target1900',
    'でる順5級.csv': 'DeruJun5',
    'でる順4級.csv': 'DeruJun4',
    'でる順3級.csv': 'DeruJun3',
    'でる順準2級.csv': 'DeruJunPre2',
    'でる順2級.csv': 'DeruJun2'
}

for csv_file, table_name in csv_to_table.items():
    file_path = os.path.join(CSV_DIR, csv_file)
    if not os.path.exists(file_path):
        print(f'File not found: {file_path}')
        continue
    
    # テーブルを作成
    cur.execute(f'''
        CREATE TABLE IF NOT EXISTS {table_name} (
            id INTEGER PRIMARY KEY,
            meaning TEXT,
            word TEXT
        )
    ''')
    
    # CSVファイルを読み込み、データを挿入（上書き保存）
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        data = [row for row in reader]
        
        # 上書き保存用に `INSERT OR REPLACE` を使用
        cur.executemany(
            f'INSERT OR REPLACE INTO {table_name} (id, meaning, word) VALUES (?, ?, ?)', 
            data
        )
        print(f'Inserted or replaced data into table: {table_name}')

conn.commit()
conn.close()
