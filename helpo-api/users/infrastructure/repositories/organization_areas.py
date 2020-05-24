from users.application.repositories import OrganizationAreasRepository
from users.domain.entities import OrganizationArea

from users.models import OrganizationArea as OrganizationAreaModel


class DjangoORMOrganizationAreasRepository(OrganizationAreasRepository):

    def get(self, id: int) -> OrganizationArea:
        model = OrganizationAreaModel.objects.get(pk=id) 
        return OrganizationArea(model.id, model.nombre)
