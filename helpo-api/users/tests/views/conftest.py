from decimal import Decimal

import inject
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from knox.models import AuthToken

from users.apps import inject_config


UserModel = get_user_model()


@pytest.fixture()
def an_email() -> str:
    return 'some@helpo.com.ar'


@pytest.fixture()
def another_email() -> str:
    return 'other@helpo.com.ar'


@pytest.fixture()
def create_default_user() -> None:
    UserModel.objects.create(
        email="removed_user",
        nombre="Removed user",
        password='nothing',
        user_type=2
    )


@pytest.fixture()
def authenticated_client(client: APIClient, an_email: str) -> APIClient:
    username = 'nevermind'
    password = 'irrelevant'
    email = an_email
    user = UserModel.objects.create(password=password, email=email, user_type=2, nombre='John Doe')
    token = AuthToken.objects.create(user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    return client


@pytest.fixture(autouse=True)
def dependency_injection_config() -> None:
    inject.clear_and_configure(inject_config)