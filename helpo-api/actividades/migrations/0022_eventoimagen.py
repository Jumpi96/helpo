# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-09-01 22:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('actividades', '0021_evento_estado'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventoImagen',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField()),
                ('evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actividades.Evento')),
            ],
        ),
    ]
