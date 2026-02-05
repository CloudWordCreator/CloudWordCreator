# TOEIC Support Walkthrough

TOEIC単語テスト機能および管理画面の実装が完了しました。以下の手順で動作確認をお願いします。

## 1. データベースの更新 (必須)

開発環境でまだマイグレーションを行っていない場合は、以下のコマンドを実行してください。

```bash
# 仮想環境を有効化 (Windows)
.\.venv\Scripts\activate

# マイグレーション
python manage.py makemigrations toeicManager
python manage.py migrate toeicManager
```

## 2. サーバー起動

```bash
python manage.py runserver
```

## 3. データの準備 (CSVインポート)

本機能を使用するにはデータが必要です。

1. **Django Admin** (`http://127.0.0.1:8000/admin/`) にアクセスし、ログインします。
2. `ToeicManager` > `Toeic words` の一覧画面右上の **「IMPORT CSV」** ボタンをクリックします。
3. `csv_uploads/TOEIC金フレ.csv` を選択してアップロードします。
4. 成功すると「Successfully imported...」と表示されます。

## 4. 機能確認

> [!IMPORTANT]
> `/toeic` および `/toeic_admin` へのアクセスにはログインが必要です。
> 未ログイン状態でアクセスすると、ログインページ (`/login/`) にリダイレクトされます。

### A. 管理画面 (ToeicAdmin)
- URL: `http://127.0.0.1:8000/toeic_admin/`
- 機能:
    - 単語一覧が表示されること。
    - 検索ボックスで単語検索ができること。
    - **「+ Add Word」** で新規追加ができること。
    - 各行の **「Edit」** で編集、**「Del」** で削除ができること。

### B. テスト機能
- URL: `http://127.0.0.1:8000/toeic/`
- 手順:
    1. **「Start」** ボタンで設定画面へ移動。
    2. Score (例: 730) や範囲を指定して **「Create Test」** をクリック。
    3. テスト画面が表示されること。
    4. 入力欄に答えを入力し、**Enterキー** で正誤判定 (緑/赤) が行われること。
    5. **「Show Answers」** で答えが表示されること。
    6. **「Print」** ボタンで印刷プレビューが正しく表示されること。

## 補足: アクセス権限 (グループの設定方法)

`/toeic` 以下の機能を利用するには、ユーザーが `toeic_users` グループに所属しているか、管理者 (superuser) である必要があります。

### グループの作成とユーザー追加手順

1. **Django Admin** (`http://127.0.0.1:8000/admin/`) にアクセスします。
2. **"Authentication and Authorization"** セクションの **"Groups"** をクリックします。
3. 右上の **"ADD GROUP +"** をクリックします。
4. Name に `toeic_users` と入力し、**SAVE** をクリックします (Permissionsは空で構いません)。
5. Adminのホームに戻り、**"Users"** をクリックします。
6. 設定したいユーザーをクリックして編集画面を開きます。
7. **"Groups"** セクションで、先ほど作成した `toeic_users` を選択し、矢印ボタンで "Chosen groups" に移動させます。
8. 画面一番下の **SAVE** をクリックします。

これで、そのユーザーは `/toeic` 以下の機能にアクセスできるようになります。
