import json

import dacite
import inject
from django.http import (
    HttpRequest,
    HttpResponse,
)
from django.utils.html import escape
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


from common.mixins import AuthTokenMixin
from common.functions import get_token_user
from users.application import (
    repositories,
)
from users.application.use_cases import remove_user, update_profile
from users.domain.entities import VolunteerProfile


class UpdateProfilePresenter(update_profile.UpdateProfileOutputBoundary):
    def present(self, output_dto: update_profile.UpdateProfileOutputBoundary) -> None:
        self._data = {
            'updated': output_dto.updated
        }

    def get_http_response(self) -> HttpResponse:
        if self._data['updated']:
            return HttpResponse('The user was updated.', status=201)
        else:
            return HttpResponse('The user could not be updated.', status=500)

@method_decorator(csrf_exempt, name='dispatch') # TODO: implement CSRF in WebApp
class UpdateProfileView(AuthTokenMixin, View):

    def put(self, request: HttpRequest, user_id: str, user_type: str) -> HttpResponse:
        data = json.loads(request.body)
        presenter = UpdateProfilePresenter()
        try:
            data['user_id'] = int(user_id)
            if user_type == 'volunteer':
                input_dto = dacite.from_dict(update_profile.UpdateVolunteerProfileInputDto, data)
                uc = update_profile.UpdateVolunteerProfileUseCase(presenter)
            elif user_type == 'organization':
                input_dto = dacite.from_dict(update_profile.UpdateOrganizationProfileInputDto, data)
                uc = update_profile.UpdateOrganizationProfileUseCase(presenter)
            else:
                return HttpResponse(str(error), status=400) 
        except dacite.exceptions.MissingValueError as error:
            return HttpResponse(str(error), status=400) 
        uc.execute(input_dto)

        return presenter.get_http_response()

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

@method_decorator(csrf_exempt, name='dispatch') # TODO: implement CSRF in WebApp
class RemoveUserView(AuthTokenMixin, View):

    def post(self, request: HttpRequest) -> HttpResponse:
        data = json.loads(request.body)
        input_dto = dacite.from_dict(remove_user.RemoveUserInputDto, {
            'email': data['email'],
            'user_id': get_token_user(request)
        })
        presenter = RemoveUserPresenter()
        uc = remove_user.RemoveUserUseCase(presenter)
        uc.execute(input_dto)

        return presenter.get_http_response()
    