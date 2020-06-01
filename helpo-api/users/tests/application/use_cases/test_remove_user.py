from unittest.mock import (
    Mock,
    patch,
)

import pytest

from users.application.use_cases import RemoveUserUseCase
from users.application.use_cases.remove_user import RemoveUserInputDto, RemoveUserOutputDto
from users.domain.entities import User


@pytest.fixture()
def user_id() -> int:
    return 10


@pytest.fixture()
def wrong_input_dto(user_id: int) -> RemoveUserInputDto:
    return RemoveUserInputDto(user_id, 'other@helpo.com.ar')


@pytest.fixture()
def input_dto(exemplary_user_email: int, user_id: int) -> RemoveUserInputDto:
    return RemoveUserInputDto(user_id, exemplary_user_email)


@pytest.mark.usefixtures('transactional_db')
def test_remove_user(
        user_id: int,
        exemplary_user_id: int,
        user: User,
        users_repo_mock: Mock,
        volunteer_profiles_repo_mock: Mock,
        input_dto: RemoveUserInputDto,
        remove_user_output_boundary_mock: Mock
) -> None:
    RemoveUserUseCase().execute(input_dto)

    users_repo_mock.get.assert_called_once_with(user_id)
    users_repo_mock.delete.assert_called_once_with(user)
    volunteer_profiles_repo_mock.delete.assert_called_once_with(exemplary_user_id)
    desired_output_dto = RemoveUserOutputDto(removed=True)
    remove_user_output_boundary_mock.present.assert_called_once_with(desired_output_dto)


def test_remove_wrong_email_user(
        user_id: int,
        user: User,
        users_repo_mock: Mock,
        wrong_input_dto: RemoveUserInputDto,
        remove_user_output_boundary_mock: Mock
) -> None:
    RemoveUserUseCase().execute(wrong_input_dto)

    users_repo_mock.get.assert_called_once_with(user_id)
    desired_output_dto = RemoveUserOutputDto(removed=False)
    remove_user_output_boundary_mock.present.assert_called_once_with(desired_output_dto)