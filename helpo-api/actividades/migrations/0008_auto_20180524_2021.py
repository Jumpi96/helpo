# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-05-24 23:21
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('actividades', '0007_auto_20180524_1213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recurso',
            name='categoria',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='actividades.CategoriaRecurso'),
        ),
    ]
