# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-05-02 14:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0021_auto_20200502_1334'),
    ]

    operations = [
        migrations.AlterField(
            model_name='volunteerprofile',
            name='phone',
            field=models.CharField(blank=True, max_length=70, null=True),
        ),
    ]
