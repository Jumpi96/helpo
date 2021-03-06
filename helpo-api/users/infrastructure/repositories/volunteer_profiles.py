from users.application.repositories import VolunteerProfilesRepository
from users.domain.entities import VolunteerProfile, Skill, OrganizationArea

from users.models import VolunteerProfile as VolunteerProfileModel, \
    OrganizationArea as OrganizationAreaModel, Skill as SkillModel


class DjangoORMVolunteerProfilesRepository(VolunteerProfilesRepository):

    def get(self, user_id: int) -> VolunteerProfile:
        v = VolunteerProfileModel.objects.get(usuario_id=user_id)
        return VolunteerProfile(
            user_id=v.user.id,
            avatar_id=v.avatar.id,
            gender=v.gender,
            last_name=v.last_name,
            birth_date=v.birth_date,
            phone=v.phone,
            profession=v.profession,
            experience=v.experience,
            educational_level=v.educational_level,
            availability=v.availability,
            state_id=v.state_id,
            city=v.city,
            modality_id=v.modality_id,
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
        model = VolunteerProfileModel.objects.get(usuario_id=profile.user_id)
        if not model:
            model = VolunteerProfileModel(
                usuario_id=profile.user_id,
                avatar_id=profile.avatar_id,
                gender=profile.gender,
                last_name=profile.last_name,
                birth_date=profile.birth_date,
                phone=profile.phone,
                profession=profile.profession,
                experience=profile.experience,
                educational_level=profile.educational_level,
                availability=profile.availability,
                state_id=profile.state_id,
                city=profile.city,
                modality_id=profile.modality_id
            )
        else:
            model.avatar_id = profile.avatar_id
            model.gender = profile.gender
            model.last_name = profile.last_name
            model.birth_date = profile.birth_date
            model.phone = profile.phone
            model.profession = profile.profession
            model.experience = profile.experience
            model.educational_level = profile.educational_level
            model.availability = profile.availability
            model.state_id = profile.state_id
            model.city = profile.city
            model.modality_id = profile.modality_id
        model.save()
        model.interests = [OrganizationAreaModel.objects.get(pk=a.id) for a in profile.interests]
        model.skills = [SkillModel.objects.get(pk=s.id) for s in profile.skills]
    
    def delete(self, user_id: int) -> None:
        VolunteerProfileModel.objects.filter(usuario__id=user_id).delete()