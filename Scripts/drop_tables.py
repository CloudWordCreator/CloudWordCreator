import sqlite3

DB_FILE = 'db.sqlite3'

# 削除するテーブルのリスト
tables_to_drop = [
    'JuniorHighEnglish1000',
    'SystemEnglish',
    'Target1900',
    'DeruJun5',
    'DeruJun4',
    'DeruJun3',
    'DeruJunPre2',
    'DeruJun2'
]

conn = sqlite3.connect(DB_FILE)
cur = conn.cursor()

for table in tables_to_drop:
    cur.execute(f'DROP TABLE IF EXISTS {table}')
    print(f'Dropped table: {table}')

conn.commit()
conn.close()




