# Generated by Django 5.1.2 on 2024-11-03 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_alter_achievement_objectives'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='achievement',
            options={'ordering': ['title']},
        ),
        migrations.AlterField(
            model_name='guide',
            name='achievement',
            field=models.ManyToManyField(related_name='guides', through='app.GuideAchievement', to='app.achievement'),
        ),
    ]