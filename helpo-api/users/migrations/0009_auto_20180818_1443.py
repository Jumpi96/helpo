# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-18 14:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20180803_1358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voluntarioprofile',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='perfil', to=settings.AUTH_USER_MODEL),
        ),
    ]