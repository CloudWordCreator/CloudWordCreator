# Generated by Django 5.1.3 on 2024-12-17 08:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csvManager', '0006_nounitword_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nounitword',
            name='text',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='no_unit_words', to='csvManager.text'),
        ),
    ]
