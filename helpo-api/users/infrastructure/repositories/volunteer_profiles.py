from users.application.repositories import VolunteerProfilesRepository
from users.domain.entities import VolunteerProfile, Skill, OrganizationArea

from users.models import VolunteerProfile as VolunteerProfileModel, \
    OrganizationArea as OrganizationAreaModel, Skill as SkillModel


class DjangoORMVolunteerProfilesRepository(VolunteerProfilesRepository):

    def get(self, user_id: int) -> VolunteerProfile:
        v = VolunteerProfileModel.objects.get(user_id=user_id)
        return VolunteerProfile(
            user_id=v.user.id,
            avatar_id=v.avatar.id,
            dni=v.dni,
            gender=v.gender,
            last_name=v.last_name,
            birth_date=v.birth_date,
            phone=v.phone,
            work_position=v.work_position,
            profession=v.profession,
            educational_level=v.educational_level,
            availability=v.availability,
            modality=v.modality,
            state_id=v.state.id,
            city=v.city,
            interests=[
                OrganizationArea(id=a.id, name=a.name)
                for a in v.organization_area_set.all()
            ],
            skills=[
                Skill(id=s.id, name=s.name)
                for s in v.skills_set.all()
            ]
        )

    def save(self, profile: VolunteerProfile) -> None:
        model = VolunteerProfileModel(
            user_id=profile.user_id,
            avatar_id=profile.avatar_id,
            dni=profile.dni,
            gender=profile.gender,
            last_name=profile.last_name,
            birth_date=profile.birth_date,
            phone=profile.phone,
            work_position=profile.work_position,
            profession=profile.profession,
            educational_level=profile.educational_level,
            availability=profile.availability,
            modality=profile.modality,
            state_id=profile.state.id,
            city=profile.city
        )
        model.save()
        model.interests = ([OrganizationAreaModel.objects.get(a.id) for a in profile.interests])
        model.skills = ([SkillModel.objects.get(s.id) for s in profile.skills])
        
    
    def delete(self, user_id: int) -> None:
        VolunteerProfileModel.objects.filter(user__id=user_id).delete()