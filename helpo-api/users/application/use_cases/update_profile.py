import abc
import inject
from dataclasses import dataclass
from django.utils import timezone
from typing import List, Optional

from users.models import Imagen, User, Ubicacion

from users.application.repositories import VolunteerProfilesRepository, SkillsRepository, OrganizationAreasRepository, OrganizationProfilesRepository
from users.domain.entities import VolunteerProfile, OrganizationProfile


@dataclass
class UpdateVolunteerProfileInputDto:
    first_name: str
    user_id: int
    avatar_url: str
    gender: str
    last_name: str
    birth_date: str
    phone: str
    profession: str
    experience: str
    educational_level: str
    availability: str
    state_id: int
    city: str
    modality_id: int
    interests: List[int]
    skills: List[int]


@dataclass
class UpdateOrganizationProfileInputDto:
    user_id: int
    avatar_url: str
    descripcion: str
    cuit: str
    telefono: str
    ubicacion: dict
    rubros: List[int]


@dataclass
class UpdateProfileOutputDto:
    profile: object
    updated: bool = True


class UpdateProfileOutputBoundary(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def present(self, output_dto: UpdateProfileOutputDto) -> None:
        pass


class UpdateVolunteerProfileUseCase:
    profiles_repo: VolunteerProfilesRepository = inject.attr(VolunteerProfilesRepository)
    interests_repo: OrganizationAreasRepository = inject.instance(OrganizationAreasRepository)
    skills_repo: SkillsRepository = inject.instance(SkillsRepository)

    @inject.params(presenter=UpdateProfileOutputBoundary)
    def __init__(self, presenter: UpdateProfileOutputBoundary) -> None:
        self.presenter = presenter

    def execute(self, input_dto: UpdateVolunteerProfileInputDto) -> None:
        # TODO: Move this logic to an Imagen repository.
        avatar_id = None
        if input_dto.avatar_url:
            new_avatar = Imagen.objects.filter(url=input_dto.avatar_url)
            if new_avatar.exists():
                avatar_id = new_avatar[0].id
            else:
                new_image = Imagen(url=input_dto.avatar_url, isExternal=False)
                new_image.save()
                avatar_id = new_image.id

        # TODO: Move this logic to an User repository.
        input_user = User.objects.get(pk=input_dto.user_id)
        input_user.nombre = input_dto.first_name
        input_user.save()

        input_profile = VolunteerProfile(
            input_dto.user_id, avatar_id, input_dto.gender, input_dto.last_name,
            None if input_dto.birth_date == "" else input_dto.birth_date, input_dto.phone, input_dto.profession,
            input_dto.experience, input_dto.educational_level, input_dto.availability,
            None if input_dto.state_id == -1 else input_dto.state_id, input_dto.city,
            None if input_dto.modality_id == -1 else input_dto.modality_id,
            [self.interests_repo.get(i) for i in input_dto.interests],
            [self.skills_repo.get(s) for s in input_dto.skills]
        )
        self.profiles_repo.save(input_profile)
        output_dto = UpdateProfileOutputDto(input_profile)

        self.presenter.present(output_dto)

    
class UpdateOrganizationProfileUseCase:
    profiles_repo: OrganizationProfilesRepository = inject.attr(OrganizationProfilesRepository)
    rubros_repo: OrganizationAreasRepository = inject.instance(OrganizationAreasRepository)

    @inject.params(presenter=UpdateProfileOutputBoundary)
    def __init__(self, presenter: UpdateProfileOutputBoundary) -> None:
        self.presenter = presenter

    def execute(self, input_dto: UpdateOrganizationProfileInputDto) -> None:
        # TODO: Move this logic to an Imagen repository.
        avatar_id = None
        if input_dto.avatar_url:
            new_avatar = Imagen.objects.filter(url=input_dto.avatar_url)
            if new_avatar.exists():
                avatar_id = new_avatar[0].id
            else:
                new_image = Imagen(url=input_dto.avatar_url, isExternal=False)
                new_image.save()
                avatar_id = new_image.id

        location = None
        if input_dto.ubicacion:
            location = Ubicacion(**input_dto.ubicacion)
            location.save()

        input_profile = OrganizationProfile(
            input_dto.user_id, avatar_id, input_dto.descripcion, input_dto.cuit,
            input_dto.telefono, location.id if location else None, [self.rubros_repo.get(i) for i in input_dto.rubros]
        )
        self.profiles_repo.save(input_profile)
        output_dto = UpdateProfileOutputDto(input_profile)

        self.presenter.present(output_dto)
