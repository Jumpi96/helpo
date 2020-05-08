from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from decouple import config
from django.conf import settings
from datetime import date
from django.db import models
from django.utils.translation import ugettext_lazy as _
from common.models import IndexedTimeStampedModel
import random
import string

class Profile(models.Model):
    usuario = models.OneToOneField('User')

    class Meta:
        abstract = True

class Imagen(models.Model):
    isExternal = models.BooleanField()
    url = models.TextField()    

    def __str__(self):
        return self.url

class OrganizationArea(models.Model):
    # nombre deberia ser Unique=True, pero me da problemas en el serializer para hacer update
    # TODO: Ver como arreglar eso, por ahora workaround -> Sacar Unique=True
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class RubroEmpresa(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Ubicacion(models.Model):
    latitud = models.FloatField()
    longitud = models.FloatField()
    notas = models.CharField(max_length=140, null=True)    

    def __str__(self):
        return self.notas + " [" + str(self.latitud) + ", " + str(self.longitud) + "]"

class OrganizacionProfile(Profile):
    verificada = models.BooleanField(default=False)
    telefono = models.BigIntegerField(blank=True, null=True)
    cuit = models.BigIntegerField(blank=True, null=True)
    rubro = models.ForeignKey(OrganizationArea, on_delete=models.SET_NULL, blank=True, null=True)
    avatar = models.ForeignKey(Imagen, on_delete=models.SET_NULL, blank=True, null=True)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.SET_NULL,blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def validate_sms(self, token):        
        sv_object = SmsVerification.objects.get(usuario=self.usuario)
        if (sv_object.verificationToken == token):
            self.verificada=True
            self.save()
            sv_object.delete()
            return True
        return False
    
class EmpresaProfile(Profile):
    verificada = models.BooleanField(default=False)
    telefono = models.BigIntegerField(null=True)
    cuit = models.BigIntegerField(blank=True, null=True)
    rubro = models.ForeignKey(RubroEmpresa, on_delete=models.SET_NULL, blank=True, null=True)
    avatar = models.ForeignKey(Imagen, on_delete=models.SET_NULL, blank=True, null=True)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.SET_NULL,blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def validate_sms(self, token):        
        sv_object = SmsVerification.objects.get(usuario=self.usuario)
        if (sv_object.verificationToken == token):
            self.verificada=True
            self.save()
            sv_object.delete()
            return True
        return False

class UserManager(BaseUserManager):

    def create_user(self, email, nombre, password, user_type, **kwargs):
        user = self.model(email=self.normalize_email(email), nombre=nombre, user_type=user_type)
        user.set_password(password)
        user.save(using=self._db)

        avatar = Imagen.objects.get(id=1)
        if "avatar" in kwargs:
            avatar_url = kwargs["avatar"]
            if avatar_url:
                new_avatar = Imagen.objects.create(isExternal=True, url=avatar_url)
                if new_avatar:
                    avatar = new_avatar

        if type(user_type) is str:
            user_type = int(user_type)
        if user_type == 1:
            profile = OrganizacionProfile.objects.create(usuario=user, avatar=avatar)
            # Inicializo suscripciones mensuales de la ong
            today = date.today()
            previous_month = date(today.year, today.month-1, 1)
            suscripciones_mensuales = OrganizacionSuscripcionesMensuales.objects.create(
                organizacion=user, fecha=previous_month, suscripciones=0)
        elif user_type == 2:
            profile = VolunteerProfile.objects.create(
                usuario=user, 
                last_name=kwargs["apellido"], 
                avatar=avatar
            )
        else:
            profile = EmpresaProfile.objects.create(usuario=user, avatar=avatar)
        self.send_confirmation_email(user)
        if not settings.DEBUG and not user_type == 2:
            self.send_warning_email(user)

        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.is_confirmed = True
        user.save(using=self._db)
        return user

    def send_confirmation_email(self, user):
        bash = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase + string.digits) for _ in range(16))
        self.create_user_verification(user, bash)

        mail_from = settings.REGISTER_EMAIL
        subject = "Verifique su registro en Helpo"
        url_confirmation = '%s/#/confirmMail/%s' % (config('URL_CLIENT', default='localhost:3000'), bash)
        from common.templates import render_verify_email
        content = render_verify_email(url_confirmation)

        from common.notifications import send_mail_to
        send_mail_to(user.email, subject, content, mail_from)

    def send_warning_email(self, user):
        mail_from = settings.REGISTER_EMAIL
        entidad = "organización" if user.user_type == 1 else "empresa"
        subject = u'ALERTA: La %s "%s" se ha registrado en Helpo' % (entidad, user.nombre)
        from common.templates import render_warning_email
        content = render_warning_email(user, entidad)
        from common.notifications import send_mail_to
        send_mail_to("consultas@helpo.com.ar", subject, content, mail_from)

    def create_user_verification(self, user, token):
        UserVerification.objects.create(usuario=user, verificationToken=token)

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
    
    def validate_mail(self, token):        
        uv_object = UserVerification.objects.get(usuario=self)
        if (uv_object.verificationToken == token):
            self.is_confirmed=True
            self.save()
            uv_object.delete()
            return True
        return False

class UserWrapper(User):
    id_token = models.TextField()


class Skill(models.Model):
    nombre = models.TextField()


class State(models.Model):
    nombre = models.TextField()


class VolunteerProfile(Profile):
    avatar = models.ForeignKey(Imagen, on_delete=models.SET_NULL, blank=True, null=True)
    dni = models.BigIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=70, blank=True, null=True)
    last_name = models.CharField(max_length=140, default='no last name')
    birth_date = models.DateField(null=True)
    phone = models.CharField(max_length=70, blank=True, null=True)
    work_position = models.CharField(max_length=140, null=True)
    profession = models.CharField(max_length=140, null=True)
    educational_level = models.CharField(max_length=140, null=True)
    availability = models.CharField(max_length=280, null=True)
    modality = models.CharField(max_length=70, null=True)
    state = models.ForeignKey(State, null=True)
    city = models.CharField(max_length=70, null=True)
    interests = models.ManyToManyField(OrganizationArea)
    skills = models.ManyToManyField(Skill)
    

class UserVerification(IndexedTimeStampedModel):
    usuario = models.OneToOneField('User')
    verificationToken = models.CharField(max_length=2000)

class SmsVerification(IndexedTimeStampedModel):
    usuario = models.OneToOneField('User')
    verificationToken = models.CharField(max_length=16)

class Profile(models.Model):
    usuario = models.OneToOneField(User)

    class Meta:
        abstract = True

"""
AppValues se va utilizar como diccionario clave-valor para
almacenar valores generales.

Precaucion: Asegurarse que la entrada este inicializada (campo creado en BD),
por ahora hay que hacerlo manual

Estructura (Mantener actualizado para saber que contiene):
    imgurAccessToken: [TOKEN]
    imgurRefreshToken: [TOKEN]
    imgurLastRefresh: (time in seconds)
"""
class AppValues(models.Model):
    key = models.TextField(primary_key=True)
    value = models.TextField()   

class DeviceID(models.Model):
    player_id = models.TextField(primary_key=True)
    email = models.EmailField(max_length=255)


class Suscripcion(models.Model):
    """
    En la suscripcion Usuario seria quien esta suscripto a
    organizacion
    (Aclaracion porque ambos son "USER")
    """
    usuario =  models.ForeignKey(User, related_name="suscripcion")
    organizacion = models.ForeignKey(User, related_name="suscriptor")

    def __str__(self):
        return self.usuario.__str__() + ' - ' + self.organizacion.__str__()

    class Meta:
        # Esto hace que solo pueda haber un par usuario-organizacion
        unique_together = ('usuario', 'organizacion')

class OrganizacionSuscripcionesMensuales(models.Model):
    """
    Modelo para registrar las suscripciones al final de cada mes
    para cada organizacion
    """
    organizacion = models.ForeignKey(User, blank=False)
    fecha = models.DateField()
    suscripciones = models.IntegerField()

    class Meta:
        #Ordenados por fecha de forma descendiente
        ordering = ["-fecha"]

