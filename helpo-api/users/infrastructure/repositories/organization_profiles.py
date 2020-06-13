from users.application.repositories import OrganizationProfilesRepository
from users.domain.entities import OrganizationProfile, OrganizationArea

from users.models import OrganizacionProfile as OrganizationProfileModel, \
    OrganizationArea as OrganizationAreaModel


class DjangoORMOrganizationProfilesRepository(OrganizationProfilesRepository):

    def get(self, user_id: int) -> OrganizationProfile:
        o = OrganizationProfileModel.objects.get(usuario_id=user_id)
        return OrganizationProfile(
            user_id=o.user.id,
            avatar_id=o.avatar.id,
            descripcion=o.descripcion,
            cuit=o.cuit,
            telefono=o.telefono,
            location_id=o.ubicacion.id,
            rubros=[
                OrganizationArea(id=a.id, name=a.name)
                for a in o.organization_area_set.all()
            ]
        )

    def save(self, profile: OrganizationProfile) -> None:
        model = OrganizationProfileModel.objects.get(usuario_id=profile.user_id)
        if not model:
            model = OrganizationProfileModel(
                usuario_id=profile.user_id,
                verificada=False,
                telefono=profile.telefono,
                cuit=profile.cuit,
                avatar_id=profile.avatar_id,
                ubicacion_id=profile.ubicacion_id,
                descripcion=profile.descripcion
            )
        else:
            model.avatar_id = profile.avatar_id
            model.telefono = profile.telefono
            model.cuit = profile.cuit
            model.ubicacion_id = profile.ubicacion_id
            model.descripcion = profile.descripcion
        model.save()
        model.rubros = [OrganizationAreaModel.objects.get(pk=a.id) for a in profile.rubros]
    
    def delete(self, user_id: int) -> None:
        OrganizationProfileModel.objects.filter(usuario__id=user_id).delete()