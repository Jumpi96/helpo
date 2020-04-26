
from django.contrib.auth.mixins import UserPassesTestMixin

from common.functions import get_token_user


class AuthTokenMixin(UserPassesTestMixin):

    def test_func(self):
        return get_token_user(self.request) is not None
