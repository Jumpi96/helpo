import abc
import pytz
from dataclasses import dataclass
from django.utils import timezone


import inject

from users.application.repositories import UsersRepository
from users.domain.entities import User


REMOVED_USER = 'removed_user'

@dataclass
class RemoveUserInputDto:
    user_id: int
    email: str


@dataclass
class RemoveUserOutputDto:
    removed: bool


class RemoveUserOutputBoundary(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def present(self, output_dto: RemoveUserOutputDto) -> None:
        pass


class RemoveUserUseCase:
    users_repo: UsersRepository = inject.attr(UsersRepository)

    @inject.params(presenter=RemoveUserOutputBoundary)
    def __init__(self, presenter: RemoveUserOutputBoundary) -> None:
        self.presenter = presenter

    def execute(self, input_dto: RemoveUserInputDto) -> None:
        user = self.users_repo.get(input_dto.user_id)

        if user.email == input_dto.email:
            self.remove_future_data(user)
            self.remove_data(user)
            self.default_past_ones(user, self.users_repo.get_by_email(REMOVED_USER))

            self.users_repo.delete(user)
            output_dto = RemoveUserOutputDto(True)
        else:
            output_dto = RemoveUserOutputDto(False)

        self.presenter.present(output_dto)

    def remove_future_data(self, user: User) -> None:
        # TODO: Replace Django models with repositories.
        from actividades.models import Evento, Colaboracion, Participacion, Propuesta

        Evento.objects.filter(organizacion_id=user.id, fecha_hora_inicio__gte=timezone.now()).delete()
        Colaboracion.objects.filter(colaborador_id=user.id, necesidad_material__evento__fecha_hora_inicio__gte=timezone.now()).delete()
        Participacion.objects.filter(colaborador_id=user.id, necesidad_voluntario__evento__fecha_hora_inicio__gte=timezone.now()).delete()
        Propuesta.objects.filter(empresa_id=user.id, evento__fecha_hora_inicio__gte=timezone.now()).delete()

    def remove_data(self, user: User) -> None:
        # TODO: Replace Django models with repositories.
        from actividades.models import Comentario, LogMensaje
        from recommendations.models import LogConsultaEvento
        from users.models import VoluntarioProfile, OrganizacionProfile, EmpresaProfile, Suscripcion
        
        Comentario.objects.filter(voluntario_id=user.id).delete()
        LogMensaje.objects.filter(usuario_id=user.id).delete()
        LogConsultaEvento.objects.filter(usuario_id=user.id).delete()
        VoluntarioProfile.objects.filter(usuario_id=user.id).delete()
        OrganizacionProfile.objects.filter(usuario_id=user.id).delete()
        EmpresaProfile.objects.filter(usuario_id=user.id).delete()
        Suscripcion.objects.filter(usuario_id=user.id).delete()
        
    def default_past_ones(self, user: User, default_user: User) -> None:
        # TODO: Replace Django models with repositories.
        from actividades.models import Evento, Colaboracion, Participacion, Propuesta

        Evento.objects.filter(organizacion_id=user.id).update(organizacion_id=default_user.id)
        Colaboracion.objects.filter(colaborador_id=user.id).update(colaborador_id=default_user.id)
        Participacion.objects.filter(colaborador_id=user.id).update(colaborador_id=default_user.id)
        Propuesta.objects.filter(empresa_id=user.id).update(empresa_id=default_user.id)