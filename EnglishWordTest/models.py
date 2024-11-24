from django.db import models

class JuniorHighEnglish1000(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'JuniorHighEnglish1000'
        managed = False

class SystemEnglish(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'SystemEnglish'
        managed = False

class Target1900(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'Target1900'
        managed = False

class DeruJun5(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'DeruJun5'
        managed = False

class DeruJun4(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'DeruJun4'
        managed = False

class DeruJun3(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'DeruJun3'
        managed = False

class DeruJunPre2(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'DeruJunPre2'
        managed = False

class DeruJun2(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=100)
    
    def __str__(self):
        return f'{self.word} - {self.meaning}'

    class Meta:
        db_table = 'DeruJun2'
        managed = False





