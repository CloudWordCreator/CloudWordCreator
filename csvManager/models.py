from django.db import models

class Text(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Unit(models.Model):
    text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name='units')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.text.name} - {self.name}"

class UnitWord(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='words')
    no = models.IntegerField()
    english = models.CharField(max_length=100)
    japanese = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.unit.name} - {self.english}"