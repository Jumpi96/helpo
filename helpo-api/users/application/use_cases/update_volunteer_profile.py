import abc
from dataclasses import dataclass
from django.utils import timezone
import inject
from typing import List

from users.models import Imagen

from users.application.repositories import VolunteerProfilesRepository, SkillsRepository, OrganizationAreasRepository
from users.domain.entities import VolunteerProfile


@dataclass
class UpdateVolunteerProfileInputDto:
    user_id: int
    avatar_url: str
    dni: int
    gender: str
    last_name: str
    birth_date: str
    phone: str
    work_position: str
    profession: str
    educational_level: str
    availability: str
    state_id: str
    city: str
    interests: List[int]
    skills: List[int]


@dataclass
class UpdateVolunteerProfileOutputDto:
    profile: VolunteerProfile
    created: bool = True


class UpdateVolunteerProfileOutputBoundary(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def present(self, output_dto: UpdateVolunteerProfileOutputDto) -> None:
        pass


class UpdateVolunteerProfileUseCase:
    profiles_repo: VolunteerProfilesRepository = inject.attr(VolunteerProfilesRepository)
    interests_repo: OrganizationAreasRepository = inject.instance(OrganizationAreasRepository)
    skills_repo: SkillsRepository = inject.instance(SkillsRepository)

    @inject.params(presenter=UpdateVolunteerProfileOutputBoundary)
    def __init__(self, presenter: UpdateVolunteerProfileOutputBoundary) -> None:
        self.presenter = presenter

    def execute(self, input_dto: UpdateVolunteerProfileInputDto) -> None:
        # TODO: Move this logic to an Imagen repository.
        avatar_id = None
        if avatar_url:
            new_avatar = Imagen.objects.filter(url=avatar_data["url"])
            if new_avatar.exists():
                avatar_id = new_avatar[0].id
            else:
                new_image = Imagen(**avatar_data, isExternal=False)
                new_image.save()
                avatar_id = new_image.id

        input_profile = VolunteerProfile(
            input_dto.user_id, avatar_id, input_dto.dni, input_dto.gender, input_dto.last_name,
            input_dto.birth_date, input_dto.phone, input_dto.work_position, input_dto.profession,
            input_dto.educational_level, input_dto.availability, input_dto.state_id, input_dto.city,
            [interests_repo.get(i) for i in input_dto.interests],
            [skills_repo.get(s) for s in input_dto.skills]
        )
        repo.save(input_profile)
        output_dto = RemoveUserOutputDto(input_profile)

        self.presenter.present(output_dto)

    