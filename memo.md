# メモ

## pythonの仮想環境をアクティブにする

ディレクトリを移動

```bash
cd venv/Scripts
```

仮想環境をアクティブにする

```bash
.\activate
```

仮想環境を非アクティブにする

```bash
.\deactivate
```

## pythonのバージョンを確認する

```bash
python --version
```

## pipのバージョンを確認する

```bash
pip --version
```

## pipのアップデート

```bash
python -m pip install --upgrade pip
```

## pipのインストール済みパッケージを確認する

```bash
pip list
```

## pipのインストール済みパッケージをファイルに出力する

```bash
pip freeze > requirements.txt
```

## pipのインストール済みパッケージをファイルからインストールする

```bash
pip install -r requirements.txt
```

# サーバーへのデプロイ

## プロジェクトの更新

```bash
cd /path/to/CloudWordCreator
git pull origin main  # または適切なブランチ名
```

自分の場合はAWSのブランチ

## フロントエンドのビルド

```bash
cd frontend
npm install  # 新しいパッケージがあれば
npm run build
cd ..
```

## バックエンドの更新

```bash
source .venv/bin/activate  # 仮想環境のアクティベート（パスは環境に合わせて）
pip install -r requirements.txt  # 新しいライブラリがあれば
python manage.py migrate
python manage.py collectstatic --noinput  # 静的ファイルをstatic配下に集める
```

## サーバーの再起動

```bash
sudo systemctl restart uwsgi
sudo systemctl restart nginx
```
