from django.test import TestCase


class ExampleTestCase(TestCase):

    def setUp(self):
        self.a = 22
        
    def test_a_equals_222(self):
        self.assertEqual(self.a, 22)