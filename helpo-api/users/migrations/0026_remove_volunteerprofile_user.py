# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-05-08 21:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_auto_20200508_2126'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='volunteerprofile',
            name='user',
        ),
    ]
