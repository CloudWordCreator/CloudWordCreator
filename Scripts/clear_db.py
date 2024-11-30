import django
import os
import sys

# プロジェクトのルートディレクトリをパスに追加
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CloudWordCreator.settings')
django.setup()

from django.contrib.auth.models import User
from EnglishWordTest.models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2

# superuserを保持するために、superuserの情報を取得
superusers = User.objects.filter(is_superuser=True)

# 各モデルの全データを削除
JuniorHighEnglish1000.objects.all().delete()
SystemEnglish.objects.all().delete()
Target1900.objects.all().delete()
DeruJun5.objects.all().delete()
DeruJun4.objects.all().delete()
DeruJun3.objects.all().delete()
DeruJunPre2.objects.all().delete()
DeruJun2.objects.all().delete()

print("全てのデータを削除し、superuserを再作成しました。")


