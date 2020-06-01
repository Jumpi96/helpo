import typing
from abc import (
    ABCMeta,
    abstractmethod
)

from users.domain.entities import Skill


class SkillsRepository(metaclass=ABCMeta):

    @abstractmethod
    def get(self, id: int) -> Skill:
        pass