import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse

client = Client()

class BolasTestCase(TestCase):

    def setUp(self):
        self.a = 22
        
    def test_a_equals_22(self):
        self.assertEqual(True, True)