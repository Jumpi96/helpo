import inject
from django.apps import AppConfig

from users.application.repositories import UsersRepository
from users.infrastructure.repositories import DjangoORMUsersRepository

def inject_config(binder: inject.Binder) -> None:
    binder.bind(UsersRepository, DjangoORMUsersRepository())


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self) -> None:
        super().ready()
        inject.configure(inject_config)
