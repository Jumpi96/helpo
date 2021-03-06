import inject
from django.apps import AppConfig



def inject_config(binder: inject.Binder) -> None:
    from users.application.repositories import UsersRepository, VolunteerProfilesRepository, \
        SkillsRepository, OrganizationAreasRepository, OrganizationProfilesRepository
    from users.infrastructure.repositories import DjangoORMUsersRepository, \
        DjangoORMVolunteerProfilesRepository, DjangoORMSkillsRepository, \
        DjangoORMOrganizationAreasRepository, DjangoORMOrganizationProfilesRepository

    binder.bind(UsersRepository, DjangoORMUsersRepository())
    binder.bind(VolunteerProfilesRepository, DjangoORMVolunteerProfilesRepository())
    binder.bind(OrganizationProfilesRepository, DjangoORMOrganizationProfilesRepository())
    binder.bind(SkillsRepository, DjangoORMSkillsRepository())
    binder.bind(OrganizationAreasRepository, DjangoORMOrganizationAreasRepository())


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self) -> None:
        super().ready()
        inject.configure(inject_config)
