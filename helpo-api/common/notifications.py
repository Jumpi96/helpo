from decouple import config
import requests
import json
import threading
import time
from random import randint
from django.conf import settings
import boto3
import logging


def _get_players_id(mails):
    from users.models import DeviceID
    device_list = DeviceID.objects.filter(email__in=mails)
    return [device.player_id for device in device_list]


def _get_email_from_id(user_id):
    from users.models import User
    return User.objects.get(id=user_id).email


def send_mail_to_id_list(ids_to, html_subject, html_content, mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    mails_to = []
    for user_id in ids_to:
        mails_to.append(_get_email_from_id(user_id))
    send_mail_to_list(mails_to, html_subject, html_content,
                      mail_from, thread_daemon)


def send_mail_to_id(id_to, html_subject, html_content, mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    mail = _get_email_from_id(id_to)
    send_mail_to(mail, html_subject, html_content, mail_from, thread_daemon)


def send_mail_to_list(mails_to=["error@helpo.com.ar"], html_subject="Error", html_content="Error", mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    send_mail_to(mails_to, html_subject, html_content,
                 mail_from, thread_daemon)


def send_mail_to_worker(url, headers, mail_to, mail_from, json_subject, json_content):
    log = logging.getLogger('django')
    if not isinstance(mail_to, (list, tuple)):
        mail_to = [mail_to]
    for mail in mail_to:
        sleep_secs = randint(30, 90)
        log.info("Enviando mail a %s desde %s, dentro de %s segundos" %
                 (mail, mail_from, sleep_secs))
        time.sleep(sleep_secs)
        payload = "{\n \"fromAddress\": \"%s\",\n \"toAddress\": \"%s\",\n \"subject\": %s,\n \"content\": %s\n}" \
            % (mail_from, mail, json_subject, json_content)
        response = requests.request("POST", url, data=payload, headers=headers)
        str_log = "Mail enviado a %s desde %s, response code: %s" % (
            mail, mail_from, response.status_code)
        if response.status_code == 500:
            str_log += ", response text: %s" % (response.text)
            log.error(str_log)
        else:
            log.info(str_log)


def send_mail_to(mail_to="error@helpo.com.ar", html_subject="Error", html_content="Error", mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    json_subject = json.dumps(html_subject)
    json_content = json.dumps(html_content)
    url = "https://mail.zoho.com/api/accounts/%s/messages" % (
        config('ZOHO_ACCOUNT_ID'))
    headers = {
        'Authorization': config('ZOHO_AUTH_TOKEN'),
        'Content-Type': "application/json; charset=utf-8"
    }
    t = threading.Thread(target=send_mail_to_worker, args=(
        url, headers, mail_to, mail_from, json_subject, json_content))
    t.daemon = thread_daemon
    t.start()


def send_push_notification_to_id_list(ids_to, en_title, es_title, en_message, es_message, thread_daemon=True):
    mails_to = []
    for user_id in ids_to:
        mails_to.append(_get_email_from_id(user_id))
    send_push_notification_to_list(
        mails_to, en_title, es_title, en_message, es_message, thread_daemon)


def send_push_notification_to_list_worker(url, payload, headers, mails_to):
    log = logging.getLogger('django')
    sleep_secs = randint(5, 55)
    log.info("Enviando notificacion push a %s, dentro de %s segundos" % (
        mails_to, sleep_secs))
    time.sleep(sleep_secs)
    response = requests.request("POST", url, data=payload, headers=headers)
    log.info("Notificacion push enviada a %s, response text: %s, response code: %s" % (
        mails_to, response.text, response.status_code))


def send_push_notification_to_list(mails_to, en_title, es_title, en_message, es_message, thread_daemon=True):
    url = "https://onesignal.com/api/v1/notifications"

    players_id_json = json.dumps(_get_players_id(mails_to))

    payload = "{\n " \
        "    \"app_id\": \"8dfa1a54-4fb2-42b3-97a6-70e004144dd5\",\n " \
        "   \"headings\": {\"en\": \"%s\", \"es\": \"%s\"},\n " \
        "   \"contents\": {\n   \t                \"en\": \"%s\",\n   \t " \
        "               \"es\": \"%s\",\n   \t                \"url\": \"https://www.helpo.com.ar\"\n " \
        "  \t\t\t\t},\n    \"include_player_ids\": %s \n}" \
        % (en_title, es_title, en_message, es_message, players_id_json)
    headers = {
        'Authorization': "Basic " + config('ONESIGNAL_REST_API_KEY'),
        'Content-Type': "application/json"
    }
    t = threading.Thread(target=send_push_notification_to_list_worker, args=(
        url, payload, headers, mails_to))
    t.daemon = thread_daemon
    t.start()


def send_push_notification_all(en_title, es_title, en_message, es_message, thread_daemon=True):
    log = logging.getLogger('django')
    url = "https://onesignal.com/api/v1/notifications"

    payload = "{\n " \
        "    \"app_id\": \"8dfa1a54-4fb2-42b3-97a6-70e004144dd5\",\n " \
        "   \"headings\": {\"en\": \"%s\", \"es\": \"%s\"},\n " \
        "   \"contents\": {\n   \t                \"en\": \"%s\",\n   \t " \
        "               \"es\": \"%s\",\n   \t                \"url\": \"https://www.helpo.com.ar\"\n " \
        "  \t\t\t\t},\n    \"included_segments\": [\"Subscribed Users\"]\n}" \
        % (en_title, es_title, en_message, es_message)
    headers = {
        'Authorization': "Basic " + config('ONESIGNAL_REST_API_KEY'),
        'Content-Type': "application/json"
    }

    response = requests.request("POST", url, data=payload, headers=headers)

    log.info("Enviando notificacion push a todos, response text: %s, response code: %s" % (
        response.text, response.status_code))


def send_sms_message_to_worker(number, message):
    log = logging.getLogger('django')
    client = boto3.client(
        "sns",
        aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY'),
        region_name="us-west-2"
    )
    client.publish(
        PhoneNumber=number,
        Message=message
    )
    log.info("Enviando mensaje SMS a %s con el texto: %s" % (number, message))


def send_sms_message_to(number="+543515056312", message="SMS from Helpo", thread_daemon=True):
    if not settings.DEBUG and number is not None:
        number = __parse_number(number)
        t = threading.Thread(
            target=send_sms_message_to_worker, args=(number, message))
        t.daemon = thread_daemon
        t.start()

    else:
        log = logging.getLogger('django')
        log.warning("Mensajes SMS solo permitidos para produccion")


def __parse_number(number):
    number = str(number)
    if number[0:3] == "+54":
        return number
    else:
        return "+54%s" % (number)
