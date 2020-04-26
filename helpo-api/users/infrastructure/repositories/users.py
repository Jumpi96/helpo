from users.application.repositories import UsersRepository
from users.domain.entities import User

from users.models import User as UserModel


class DjangoORMUsersRepository(UsersRepository):

    def get(self, id: str) -> User:
        return UserModel.objects.get(pk=id)

    def get_by_email(self, email: str) -> User:
        user = UserModel.objects.filter(email=email)
        if user.exists():
            return user[0]

        
    def delete(self, user: User) -> None:
        UserModel.objects.get(pk=user.id).delete()
