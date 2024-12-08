from django.shortcuts import render
import random
from EnglishWordTest.models import JuniorHighEnglish1000, SystemEnglish, Target1900, DeruJun5, DeruJun4, DeruJun3, DeruJunPre2, DeruJun2
from dotenv import load_dotenv
import os
import json
# Geminiを使うためのライブラリのインポート
import google.generativeai as genai

load_dotenv()
AI_APIKEY = os.getenv('Gemini_APIKEY')
genai.configure(api_key=AI_APIKEY)

def generate_fill_in_the_blank(request):
    if request.method == 'POST':
        text = request.POST.get('mySelect')
        start = int(request.POST.get('startNumber'))
        end = int(request.POST.get('endNumber'))
        question_count = request.POST.get('questionCount')
        # デフォルトの問題数
        count = 25
        # テキストに対応するモデルを選択
        model_map = {
            'option1': JuniorHighEnglish1000,
            'option2': SystemEnglish,
            'option3': Target1900,
            'option4': DeruJun5,
            'option5': DeruJun4,
            'option6': DeruJun3,
            'option7': DeruJunPre2,
            'option8': DeruJun2
        }
        # テキストを日本語に変換
        text_map = {
            'option1': '中学英単語1000',
            'option2': 'システム英単語',
            'option3': 'ターゲット1900',
            'option4': 'でる順5級',
            'option5': 'でる順4級',
            'option6': 'でる順3級',
            'option7': 'でる順準2級',
            'option8': 'でる順2級'
        }

        model = model_map.get(text)
        selected_text_jp = text_map.get(text)

        if model:
            # 指定された範囲の数を取得
            range_size = end - start + 1

            # 問題数が範囲の数を超えている場合、範囲の数に合わせる
            if count > range_size:
                count = range_size

            # 指定された範囲からランダムにIDを選択
            ids = random.sample(range(start, end + 1), count)
            words = list(model.objects.filter(id__in=ids))
            phrase = ai_prompt(words, question_count)
            options = words.copy()
            random.shuffle(options)
            return render(request, 'result.html',{
                'fill_in_the_blank': phrase,
                'text' : selected_text_jp,
                'start_number': start,
                'end_number': end,
                'options': options,
            })

def ai_prompt(word, question_count):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"以下の単語を全て用いて穴埋め問題と、その文章の日本語の意味を{question_count}問作成してください。"\
        f"\n\n{word}\n\n返答は以下のJson形式でお願いします。"\
        "{"\
            '"number": 問題の番号,'\
            '"questionPhrase": "問題文",'\
            '"ansewerWord": "答え(2つ以上ある場合はhello, wordの形式)",'\
            '"Japanese": "日本語訳"'\
        '},"'
    response = model.generate_content(prompt)
    try:
        test_data = json.loads(clean_json_text(response.text))
        return test_data
    except json.JSONDecodeError as e:
        print(e)
        test_data = {
            "error": "エラーが発生しました。もう一度お試しください。"
        }
    return test_data

def clean_json_text(text):
    # 不要な部分を削除してJSON形式に変換
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    
    # JSONの各エントリが正しい形式であることを確認
    try:
        json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError during clean_json_text: {e}")
    return text