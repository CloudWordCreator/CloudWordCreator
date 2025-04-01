from django.db import models

class Text(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Unit(models.Model):
    text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name='units')
    name = models.CharField(max_length=100)
    # 親ユニット unit1-1, unit1-2 をまとめている 
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subunits', null=True, blank=True)

    def __str__(self):
        return f"{self.text.name} - {self.name}"

class UnitWord(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='words')
    no = models.IntegerField()
    english = models.CharField(max_length=100)
    japanese = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.unit.name} - {self.english} - {self.japanese}"

class NoUnitWord(models.Model):
    text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name='no_unit_words')
    no = models.IntegerField()
    english = models.CharField(max_length=100)
    japanese = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.text.name} - {self.no} - {self.english} - {self.japanese}"