from users.models import SmsVerification
from common.notifications import send_sms_message_to
import random
import string


def send_confirmation_sms(perfil):
    if perfil is not None:
        sms_verification = __create_sms_verification(perfil.usuario)
        if sms_verification is not None:
            message = "Su código en Helpo es: %s" % (
                sms_verification.verificationToken)
            send_sms_message_to(perfil.telefono, message)


def __generate_token():
    bash = ''.join(random.SystemRandom().choice(
        string.ascii_uppercase + string.digits) for _ in range(6))
    return bash


def __create_sms_verification(user):
    sms_verification = SmsVerification.objects.filter(usuario=user).first()
    if sms_verification is None:
        token = __generate_token()
        sms_verification = SmsVerification.objects.create(
            usuario=user, verificationToken=token)
    return sms_verification
