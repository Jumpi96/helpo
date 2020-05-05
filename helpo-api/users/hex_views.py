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
from users.application import (
    repositories,
)
from users.application.use_cases import remove_user
from users.domain.entities import VolunteerProfile

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


@method_decorator(csrf_exempt, name='dispatch') # TODO: implement CSRF in WebApp
class UpdateProfileView(AuthTokenMixin, View):

    def put(self, request: HttpRequest, user_id: int) -> HttpResponse:
        repo: repositories.VolunteerProfilesRepository = inject.instance(repositories.VolunteerProfilesRepository)
        interests_repo: repositories.OrganizationAreasRepository = inject.instance(repositories.OrganizationAreasRepository)
        skills_repo: repositories.SkillsRepository = inject.instance(repositories.SkillsRepository)
        data = json.loads(request.body)
        input_profile = VolunteerProfile(
            data['user_id'], data['avatar_id'], data['dni'], data['gender'], data['last_name'],
            data['birth_date'], data['phone'], data['work_position'], data['profession'],
            data['educational_level'], data['availability'], data['state_id'], data['city'],
            [interests_repo.get(i) for i in data['interests']],
            [skills_repo.get(s) for s in data['skills']]
        )
        repo.save(input_profile)
        return HttpResponse(data, status=200)


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
    