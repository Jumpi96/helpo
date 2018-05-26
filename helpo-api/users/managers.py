from django.contrib.auth.models import BaseUserManager
from django.core.mail import send_mail
from users.models import VoluntarioProfile, OrganizacionProfile, EmpresaProfile

class UserManager(BaseUserManager):

    def create_user(self, nombre, email, password, user_type, apellido=None):
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, user_type=user_type)
        user.set_password(password)
        user.save(using=self._db)
        if user_type == 1:
            profile = OrganizacionProfile.objects.create(user=user)
        elif user_type == 2:
            profile = VoluntarioProfile.objects.create(user=user, apellido=apellido)
        else:
            profile = EmpresaProfile.objects.create(user=user)
        send_confirmation_email(user)
        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    def send_confirmation_email(self, user):
        content = ''
        send_mail(
            'Confirma tu cuenta de helpo.',
            '',
            'helpo@helpo.com',
            user.email,
            fail_silently=True,
            html_message=content
        )