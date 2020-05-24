

class Skill:
    def __init__(self, id: int, name: str) -> None:
        self.id = id
        self.name = name

    def __str__(self):
        return f'<OrganizationArea {self.name}>'