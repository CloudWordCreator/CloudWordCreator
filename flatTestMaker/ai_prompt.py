import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

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