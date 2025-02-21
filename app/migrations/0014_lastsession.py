# Generated by Django 5.0.2 on 2024-11-15 14:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_alter_guide_objectives'),
    ]

    operations = [
        migrations.CreateModel(
            name='LastSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_achievement', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.achievement')),
                ('last_guide', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.guide')),
            ],
            options={
                'verbose_name': 'Dernière session',
                'verbose_name_plural': 'Dernières sessions',
            },
        ),
    ]
