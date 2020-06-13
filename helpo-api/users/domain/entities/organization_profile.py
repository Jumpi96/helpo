import typing

from users.domain.entities.organization_area import OrganizationArea


class OrganizationProfile:
    def __init__(self, user_id: int, avatar_id: int, descripcion: str, cuit: int, \
            telefono: int, ubicacion_id: int, rubros: typing.List[OrganizationArea]) -> None:
        self.id = id
        self.user_id = user_id
        self.avatar_id = avatar_id
        self.descripcion = descripcion
        self.cuit = cuit
        self.telefono = telefono
        self.ubicacion_id = ubicacion_id
        self.rubros = rubros

    def __str__(self):
        return f'<OrganizationProfile User: {self.user_id}>'