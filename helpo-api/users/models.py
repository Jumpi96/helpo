from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _

from common.models import IndexedTimeStampedModel

#from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    USER_TYPE_CHOICES = (
        (0, 'other'),
        (1, 'organizacion'),
        (2, 'voluntario'),
        (3, 'empresa')
    )
    nombre = models.CharField(max_length=140, unique=True)
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES)
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(
        default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(
        default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.'))
    is_confirmed = models.BooleanField(
        default=False
    )

    #objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'user_type']

    def get_full_name(self):
        return self.nombre

    def get_short_name(self):
        return self.nombre

    def __str__(self):
        return self.email


class Profile(models.Model):
    usuario = models.OneToOneField(User)#settings.AUTH_USER_MODEL)

    class Meta:
        abstract = True

class VoluntarioProfile(Profile):
    apellido = models.CharField(max_length=50)

class OrganizacionProfile(Profile):
    verificada = models.BooleanField(default=False)
    
class EmpresaProfile(Profile):
    telefono = models.IntegerField(null=True)
