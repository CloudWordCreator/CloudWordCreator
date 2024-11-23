from django.db import models

class JuniorHighEnglish1000(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class SystemEnglish(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class Target1900(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class DeruJun5(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class DeruJun4(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class DeruJun3(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class DeruJunPre2(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

class DeruJun2(models.Model):
    id = models.IntegerField(primary_key=True)  # idフィールドを明示的に追加
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'




