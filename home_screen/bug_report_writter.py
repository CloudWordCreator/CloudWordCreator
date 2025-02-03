# 報告された内容をSpreadSheetに書き込む
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
from dotenv import load_dotenv
import json
import datetime
from django.core.mail import send_mail
from django.conf import settings

load_dotenv()

SCOPE = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive'
         ]

SHEET_ID = os.getenv('SPREADSHEET_ID')

JSON_FILE = os.getenv('JSON_FILE')

class SpreadSheetWriter:
    """
    SpreadSheetWriterクラス

    report : dict
    """

    def __init__(self, report):
        # 認証情報の設定
        try:
            self.__credentials = ServiceAccountCredentials.from_json_keyfile_name(JSON_FILE, SCOPE)
            self.__gc = gspread.authorize(self.__credentials)
            self.__sh = self.__gc.open_by_key(SHEET_ID)
            self.__bug_report = self.__sh.get_worksheet(0)  # 報告を保存するシート
            self.__address_list = self.__sh.get_worksheet(1)  # メールアドレス用シート
        except gspread.exceptions.SpreadsheetNotFound as e:
            print(f"Spreadsheet not found. Check the SHEET_ID or permissions: {SHEET_ID}")
            raise e
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise e

        self.report = report

    def write_report(self):
        """
        バグ報告を書き込む
        """
        now_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # 書き込む内容を設定（辞書データから取得）
        report_data = [
            now_time,
            self.report.get("schoolName", ""),
            self.report.get("material", ""),
            self.report.get("details", ""),
        ]

        # 一番上に追加（書き込み処理）
        self.__bug_report.append_row(report_data)

    def send_notification(self):
        """
        メール通知を送信する
        """
        # メールアドレスリストを取得
        address_list = self.__address_list.get_all_values()  # スプレッドシートのアドレスリストを取得
        email_addresses = [row[0] for row in address_list if row]  # メールアドレスを抽出

        # メールタイトルと本文を作成
        subject = "新しいバグ報告がありました"
        message = (
            f"以下の内容でバグ報告が送信されました。\n\n"
            f"校舎名: {self.report.get('schoolName', '')}\n"
            f"教材: {self.report.get('material', '')}\n"
            f"詳細: {self.report.get('details', '')}\n\n"
            f"スプレッドシートを確認してください。"
        )
        from_email = settings.EMAIL_HOST_USER

        # メール送信処理
        try:
            send_mail(
                subject,
                message,
                from_email,
                email_addresses,  # 取得したメールアドレスリストを使用
                fail_silently=False,  # 失敗時に例外を発生させる
            )
            print("メール通知が正常に送信されました。")
        except Exception as e:
            print(f"メール送信中にエラーが発生しました: {e}")