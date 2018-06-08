from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from decouple import config
from hashlib import sha256
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import ugettext_lazy as _
from common.models import IndexedTimeStampedModel

class Profile(models.Model):
    usuario = models.OneToOneField('User')

    class Meta:
        abstract = True

class VoluntarioProfile(Profile):
    apellido = models.CharField(max_length=50)

class OrganizacionProfile(Profile):
    verificada = models.BooleanField(default=False)
    
class EmpresaProfile(Profile):
    telefono = models.IntegerField(null=True)

class UserManager(BaseUserManager):

    def create_user(self, email, nombre, password, user_type, **kwargs):
        user = self.model(email=self.normalize_email(email), nombre=nombre, user_type=user_type)
        user.set_password(password)
        user.save(using=self._db)
        
        if user_type == 1:
            profile = OrganizacionProfile.objects.create(usuario=user)
        elif user_type == 2:
            profile = VoluntarioProfile.objects.create(usuario=user, apellido=kwargs["apellido"])
        else:
            profile = EmpresaProfile.objects.create(usuario=user)
        self.send_confirmation_email(user)
        
        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    def send_confirmation_email(self, user):
        str_to_encode = str(user.id) + user.email
        str_encoded = str_to_encode.encode('utf-8')
        bash = sha256(str_encoded)
        url_confirmation = '%sconfirm-email?bash=%s' % (config('URL_CLIENT', default=None), bash)
        content = '<a href="%s">Confirma su cuenta aquí</a>' % (url_confirmation)
        send_mail(
            'Confirma tu cuenta de helpo.',
            url_confirmation,
            'helpo@helpo.com',
            [user.email],
            fail_silently=True,
            html_message=content,
        )


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    USER_TYPE_CHOICES = (
        (0, 'other'),
        (1, 'organizacion'),
        (2, 'voluntario'),
        (3, 'empresa')
    )
    nombre = models.CharField(max_length=140)
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

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'user_type']

    def get_full_name(self):
        return self.nombre

    def get_short_name(self):
        return self.nombre

    def __str__(self):
        return self.email


class Profile(models.Model):
    usuario = models.OneToOneField(User)

    class Meta:
        abstract = True

class VoluntarioProfile(Profile):
    apellido = models.CharField(max_length=50)

class OrganizacionProfile(Profile):
    verificada = models.BooleanField(default=False)
    
class EmpresaProfile(Profile):
    telefono = models.IntegerField(null=True)
