from decouple import config
import requests
import json
import threading
import time
from random import randint
from django.conf import settings
import boto3


def _get_players_id(mails):
    from users.models import DeviceID
    device_list = DeviceID.objects.filter(email__in=mails)
    return [device.player_id for device in device_list]


def _get_email_from_id(user_id):
    from users.models import User
    return User.objects.get(id=user_id).email


def send_mail_to_id_list(ids_to, html_subject, html_content, mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    for user_id in ids_to:
        send_mail_to_id(user_id, html_subject, html_content,
                        mail_from, thread_daemon)


def send_mail_to_id(id_to, html_subject, html_content, mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    mail = _get_email_from_id(id_to)
    send_mail_to(mail, html_subject, html_content, mail_from, thread_daemon)


def send_mail_to_list(mails_to=["error@helpo.com.ar"], html_subject="Error", html_content="Error", mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    for mail in mails_to:
        send_mail_to(mail, html_subject, html_content,
                     mail_from, thread_daemon)


def send_mail_to_worker(url, payload, headers, mail_to, mail_from):
    sleep_secs = randint(5, 55)
    print("Enviando mail a %s desde %s, dentro de %s segundos" %
          (mail_to, mail_from, sleep_secs))
    time.sleep(sleep_secs)
    response = requests.request("POST", url, data=payload, headers=headers)
    print("Mail enviado a %s desde %s, response code: %s" %
          (mail_to, mail_from, response.status_code))


def send_mail_to(mail_to="error@helpo.com.ar", html_subject="Error", html_content="Error", mail_from=settings.NOTIFICATION_EMAIL, thread_daemon=True):
    json_subject = json.dumps(html_subject)
    json_content = json.dumps(html_content)
    url = "https://mail.zoho.com/api/accounts/%s/messages" % (
        config('ZOHO_ACCOUNT_ID'))
    payload = "{\n \"fromAddress\": \"%s\",\n \"toAddress\": \"%s\",\n \"subject\": %s,\n \"content\": %s\n}" \
        % (mail_from, mail_to, json_subject, json_content)
    headers = {
        'Authorization': config('ZOHO_AUTH_TOKEN'),
        'Content-Type': "application/json; charset=utf-8"
    }
    t = threading.Thread(target=send_mail_to_worker, args=(
        url, payload, headers, mail_to, mail_from))
    t.daemon = thread_daemon
    t.start()


def send_push_notification_to_id_list(ids_to, en_title, es_title, en_message, es_message, thread_daemon=True):
    mails_to = []
    for user_id in ids_to:
        mails_to.append(_get_email_from_id(user_id))
    send_push_notification_to_list(
        mails_to, en_title, es_title, en_message, es_message, thread_daemon)


def send_push_notification_to_list_worker(url, payload, headers, mails_to):
    sleep_secs = randint(5, 55)
    print("Enviando notificacion push a %s, dentro de %s segundos" % (
        mails_to, sleep_secs))
    time.sleep(sleep_secs)
    response = requests.request("POST", url, data=payload, headers=headers)
    print("Notificacion push enviada a %s, response text: %s, response code: %s" % (
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

    print("Enviando notificacion push a todos, response text: %s, response code: %s" % (
        response.text, response.status_code))


def send_sms_message_to(number="+543515056312"):
    message = "Hello world"
    if settings.DEBUG:
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
        print("Enviando mensaje SMS a %s con el texto: %s" % (number, message))
    else:
        print("Mensajes SMS solo permitidos para produccion")
