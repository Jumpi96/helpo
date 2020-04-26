import json

import dacite
import inject
from django.http import (
    HttpRequest,
    HttpResponse,
)
from django.utils.html import escape
from django.views import View

from common.mixins import AuthTokenMixin
from common.functions import get_token_user
from users.application.use_cases import remove_user


class RemoveUserPresenter(remove_user.RemoveUserOutputBoundary):
    def present(self, output_dto: remove_user.RemoveUserOutputBoundary) -> None:
        self._data = {
            'removed': output_dto.removed
        }

    def get_http_response(self) -> HttpResponse:
        if self._data['removed']:
            return HttpResponse('The user was removed.', status=204)
        else:
            return HttpResponse('The email input is incorrect.', status=400)


class RemoveUserView(AuthTokenMixin, View):

    def delete(self, request: HttpRequest) -> HttpResponse:
        data = json.loads(request.body)
        input_dto = dacite.from_dict(remove_user.RemoveUserInputDto, {
            'email': data['email'],
            'user_id': get_token_user(request)
        })
        presenter = RemoveUserPresenter()
        uc = remove_user.RemoveUserUseCase(presenter)
        uc.execute(input_dto)

        return presenter.get_http_response()
    