from abc import (
    ABCMeta,
    abstractmethod
)

from users.domain.entities import User


class UsersRepository(metaclass=ABCMeta):

    @abstractmethod
    def get(self, id: int) -> User:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        pass
    
    @abstractmethod
    def delete(self, user: User) -> None:
        pass