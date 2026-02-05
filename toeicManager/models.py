from django.db import models

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
