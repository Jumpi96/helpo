import typing

from users.domain.entities.organization_area import OrganizationArea
from users.domain.entities.skill import Skill


class VolunteerProfile:
    def __init__(self, user_id: int, avatar_id: int, gender: str, last_name: str, \
            birth_date: str, phone: str, profession: str, experience: str, \
            educational_level: str, availability: str, state_id: int, \
            city: str, modality_id: int, interests: typing.List[OrganizationArea], \
            skills: typing.List[Skill]) -> None:
        self.id = id
        self.user_id = user_id
        self.avatar_id = avatar_id
        self.gender = gender
        self.last_name = last_name
        self.birth_date = birth_date
        self.phone = phone
        self.profession = profession
        self.experience = experience
        self.educational_level = educational_level
        self.availability = availability
        self.state_id = state_id
        self.city = city
        self.modality_id = modality_id
        self.interests = interests
        self.skills = skills

    def __str__(self):
        return f'<VolunteerProfile User: {self.user_id}>'