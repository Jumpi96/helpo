from decimal import Decimal
from unittest.mock import Mock, PropertyMock

import inject
import pytest

from users.application.repositories import UsersRepository
from users.application.use_cases.remove_user import RemoveUserOutputBoundary
from users.domain.entities import User


@pytest.fixture()
def exemplary_user_id() -> int:
    return 1


@pytest.fixture()
def exemplary_user_email() -> str:
    return 'test@helpo.com.ar'


@pytest.fixture()
def user(exemplary_user_id: int, exemplary_user_email: str) -> User:
    return User(id=exemplary_user_id, email=exemplary_user_email, nombre="John Doe", user_type=1, is_staff=False, is_active=True, is_confirmed=True)


@pytest.fixture()
def users_repo_mock(user: User) -> Mock:
    return Mock(spec_set=UsersRepository, get_by_email=Mock(return_value=user), delete=Mock(), get=Mock(return_value=user))


@pytest.fixture()
def remove_user_output_boundary_mock() -> Mock:
    return Mock(spec_set=RemoveUserOutputBoundary)


@pytest.fixture(autouse=True)
def dependency_injection_config(
    users_repo_mock: Mock,
    remove_user_output_boundary_mock: Mock
) -> None:
    def configure(binder: inject.Binder) -> None:
        binder.bind(UsersRepository, users_repo_mock)
        binder.bind(RemoveUserOutputBoundary, remove_user_output_boundary_mock)

    inject.clear_and_configure(configure)