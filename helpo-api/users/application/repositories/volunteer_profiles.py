from abc import (
    ABCMeta,
    abstractmethod
)

from users.domain.entities import VolunteerProfile


class VolunteerProfilesRepository(metaclass=ABCMeta):

    @abstractmethod
    def get(self, user_id: int) -> VolunteerProfile:
        pass

    @abstractmethod
    def save(self, profile: VolunteerProfile) -> None:
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> None:
        pass