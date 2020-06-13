from abc import (
    ABCMeta,
    abstractmethod
)

from users.domain.entities import OrganizationProfile


class OrganizationProfilesRepository(metaclass=ABCMeta):

    @abstractmethod
    def get(self, user_id: int) -> OrganizationProfile:
        pass

    @abstractmethod
    def save(self, profile: OrganizationProfile) -> None:
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> None:
        pass