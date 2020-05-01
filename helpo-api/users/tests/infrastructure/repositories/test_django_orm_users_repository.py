from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model

from users.infrastructure.repositories import DjangoORMUsersRepository
from users.domain.entities import User


DjangoUserModel = get_user_model()


@pytest.fixture()
def existing_user() -> DjangoUserModel:
    return DjangoUserModel.objects.create(
        email="test@helpo.com",
        nombre="Test user",
        password="foo",
        user_type=2
    )


@pytest.mark.usefixtures('transactional_db')
def test_get_existing_user_by_email(existing_user: DjangoUserModel) -> None:
    user = DjangoORMUsersRepository().get_by_email("test@helpo.com")

    assert user.email == existing_user.email
    assert user.nombre == existing_user.nombre
    assert user.user_type == existing_user.user_type


@pytest.mark.usefixtures('transactional_db')
def test_get_existing_user_by_id(existing_user: DjangoUserModel) -> None:
    user = DjangoORMUsersRepository().get(existing_user.id)

    assert user.email == existing_user.email
    assert user.nombre == existing_user.nombre
    assert user.user_type == existing_user.user_type


@pytest.mark.usefixtures('transactional_db')
def test_remove_existing_user_by_email(existing_user: DjangoUserModel) -> None:
    DjangoORMUsersRepository().delete(existing_user)

    assert not DjangoUserModel.objects.filter(id=existing_user.id).exists()
