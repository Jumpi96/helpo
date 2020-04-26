
USER_TYPE_CHOICES = (
    (0, 'other'),
    (1, 'organizacion'),
    (2, 'voluntario'),
    (3, 'empresa')
)

class User:
    def __init__(self, id: int, nombre: str, user_type: int, email: str, is_staff: bool, \
            is_active: bool, is_confirmed: bool) -> None:
        assert user_type in [t[0] for t in USER_TYPE_CHOICES]
        self.id = id
        self.nombre = nombre
        self.user_type = user_type
        self.email = email
        self.is_staff = is_staff
        self.is_active = is_active
        self.is_confirmed = is_confirmed

    def __str__(self):
        return f'<User {self.email}>'