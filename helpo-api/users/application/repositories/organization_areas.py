from abc import (
    ABCMeta,
    abstractmethod
)

from users.domain.entities import OrganizationArea


class OrganizationAreasRepository(metaclass=ABCMeta):

    @abstractmethod
    def get(self, id: int) -> OrganizationArea:
        pass