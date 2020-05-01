import inject
from django.apps import AppConfig



def inject_config(binder: inject.Binder) -> None:
    from users.application.repositories import UsersRepository
    from users.infrastructure.repositories import DjangoORMUsersRepository

    binder.bind(UsersRepository, DjangoORMUsersRepository())


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self) -> None:
        super().ready()
        inject.configure(inject_config)
