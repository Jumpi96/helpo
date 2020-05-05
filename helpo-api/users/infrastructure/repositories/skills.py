from users.application.repositories import SkillsRepository
from users.domain.entities import Skill

from users.models import Skill as SkillModel


class DjangoORMSkillsRepository(SkillsRepository):

    def get(self, id: int) -> Skill:
        model = SkillModel.objects.get(pk=id) 
        return Skill(model.id, model.name)
