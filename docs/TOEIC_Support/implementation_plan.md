# TOEIC対応 実装計画

TOEIC単語テスト機能を追加するための実装計画です。既存の`csvManager`とは別に、新しいアプリケーション`toeicManager`を作成し、完全に独立したモデルとロジックを実装します。

## ユーザーレビューが必要な事項

> [!IMPORTANT]
> **アクセス権限の管理**
> `/toeic` へのアクセス制限には、Djangoの標準機能である「グループ (Group)」を使用します。
> `toeic_users` というグループを作成し、そのグループに所属しているユーザーのみがアクセスできるように実装します。

## 提案する変更

### Backend (Django)

#### [NEW] `toeicManager` アプリケーション
既存のロジックと分離するため、新規アプリケーションを作成します。

#### [NEW] [toeicManager/models.py](file:///c%3A/Users/sabax/source/repos/CloudWordCreator/toeicManager/models.py)
- Create `ToeicMaterial` model (name)
- Update `ToeicWord` to ForeignKey `ToeicMaterial`

#### [MODIFY] [toeicManager/csv_importer.py](file:///c%3A/Users/sabax/source/repos/CloudWordCreator/toeicManager/csv_importer.py)
- Accept `material_id` or name to link words.

#### [MODIFY] [toeicManager/views.py](file:///c%3A/Users/sabax/source/repos/CloudWordCreator/toeicManager/views.py)
- `get_settings`: Return list of materials.
- `get_words`: Filter by material.
- `upload_csv`: Accept material selection.

##### [NEW] `toeicManager/models.py`
```python
class ToeicWord(models.Model):
    # CSVの "No"
    no = models.IntegerField()
    # CSVの "score" (グルーピングに使用)
    score = models.IntegerField()
    # CSVの "phrase"
    phrase = models.CharField(max_length=255)
    # CSVの "pharseJP" (typo修正 -> phrase_jp)
    phrase_jp = models.CharField(max_length=255)
    # CSVの "英語"
    english = models.CharField(max_length=100)
    # CSVの "日本語"
    japanese = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.no}: {self.english}"
```

##### [NEW] `toeicManager/csv_importer.py`
TOEIC形式のCSV (`No,score,phrase,phraseJP,英語,日本語`) を読み込む専用ロジックを実装します。

##### [NEW] `toeicManager/views.py` & `urls.py`
- `ToeicWord` データを取得するためのAPIエンドポイントを作成します。
- ユーザーが `toeic_users` グループに所属しているかチェックするPermissionクラスを適用します。

### Frontend (React)

#### [MODIFY] `src/App.jsx`
- `/toeic` ルートおよび関連するサブルート (`/toeic/settings`, `/toeic/test`) を追加します。

#### [NEW] `src/components/ToeicHome.jsx`
- TOEICテストのトップ画面。権限がない場合はアクセス拒否メッセージを表示します。

#### [NEW] `src/components/ToeicTestMaker.jsx`
- **Reuse Strategy**: `FlatTestMaker.jsx` をベースにコピー＆修正します。
- 範囲指定だけでなく、「Score (600, 730, 800, 900等)」でのフィルタリング機能を追加検討します。
- APIリクエスト先を `toeicManager` のエンドポイントに変更します。

#### [NEW] `src/components/ToeicTestResult.jsx` & `ToeicTestInteractive.jsx`
- **Reuse Strategy**: `WordTestResult.jsx` のCSS (`paper-setup.css` 等) はそのまま利用し、印刷機能をサポートします。
- **New Feature**: ユーザー要望の「インタラクティブなテスト（入力→正誤判定）」は新規コンポーネントとして実装、または `ToeicTestResult` 内の新しいモードとして追加します。
    - テーブルのセルを `<input>` にし、Enterキーで判定ロジックを実行。

#### [NEW] `src/components/ToeicAdmin.jsx` & `ToeicEdit.jsx`
- 既存の `Dashboard.jsx`, `EditText.jsx` を参考にTOEIC用の管理画面を作成。
- `/toeic_admin` ルートでアクセス。
- **機能**:
    - 単語一覧表示 (ページネーションまたは無限スクロール推奨)
    - 単語の追加・削除・編集機能
    - CSVインポート機能へのリンク

## 検証計画

### 自動テスト
- `csv_importer.py` の単体テストを作成し、サンプルCSVが正しくDBに格納されるか確認します。
- `ToeicWord` のCRUD操作を行うAPIのテスト。

### 手動検証
1. **データ取り込み**: `TOEIC金フレ.csv` をインポートし、Admin画面で正しく登録されているか確認。
2. **権限チェック**:
    - グループなしユーザー -> `/toeic` にアクセス不可 (403/Redirect)。
    - `toeic_users` 所属ユーザー -> `/toeic` にアクセス可。
3. **テスト動作**:
    - 設定画面 (`ToeicTestMaker`) で範囲や条件を指定できること。
    - テスト画面で表形式の入力ができ、正誤判定が機能すること。
    - 印刷プレビューが既存のテスト同様に綺麗に表示されること。
4. **管理画面**:
    - `/toeic_admin` で単語リストが見れること。
    - 編集・追加・削除が反映されること。
