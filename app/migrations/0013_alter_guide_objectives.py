# Generated by Django 5.0.2 on 2024-11-11 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_guide_important_info_dungeon_dungeonquest_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guide',
            name='objectives',
            field=models.TextField(max_length=500, verbose_name='Objectifs'),
        ),
    ]
