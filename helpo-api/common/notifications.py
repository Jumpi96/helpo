from decouple import config
import requests
import json


def _get_players_id(mails):
    from users.models import DeviceID
    device_list = DeviceID.objects.filter(email__in=mails)
    return [device.player_id for device in device_list]


def _get_email_from_id(user_id):
    from users.models import User
    return User.objects.get(id=user_id).email


def send_mail_to_id_list(ids_to, subject, html_content, mail_from="notificaciones@helpo.com.ar"):
    for user_id in ids_to:
        send_mail_to_id(user_id, subject, html_content, mail_from)


def send_mail_to_id(id_to, subject, html_content, mail_from="notificaciones@helpo.com.ar"):
    mail = _get_email_from_id(id_to)
    send_mail_to(mail, subject, html_content, mail_from)


def send_mail_to_list(mails_to=["error@helpo.com.ar"], subject="Error", html_content="Error", mail_from="notificaciones@helpo.com.ar"):
    for mail in mails_to:
        send_mail_to(mail, subject, html_content, mail_from)


def send_mail_to(mail_to="error@helpo.com.ar", subject="Error", html_content="Error", mail_from="notificaciones@helpo.com.ar"):
    url = "https://mail.zoho.com/api/accounts/%s/messages" % (
        config('ZOHO_ACCOUNT_ID'))
    payload = "{\n \"fromAddress\": \"%s\",\n \"toAddress\": \"%s\",\n \"subject\": \"%s\",\n \"content\": %s\n}" \
        % (mail_from, mail_to, subject, html_content)
    headers = {
        'Authorization': config('ZOHO_AUTH_TOKEN'),
        'Content-Type': "application/json"
    }

    response = requests.request("POST", url, data=payload, headers=headers)
    print("Enviando mail a %s desde %s, response code: %s" %
          (mail_to, mail_from, response.status_code))


def send_push_notification_to_id_list(ids_to, en_title, es_title, en_message, es_message):
    mails_to = []
    for user_id in ids_to:
        mails_to.append(_get_email_from_id(user_id))
    send_push_notification_to_list(
        mails_to, en_title, es_title, en_message, es_message)


def send_push_notification_to_list(mails_to, en_title, es_title, en_message, es_message):
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

    response = requests.request("POST", url, data=payload, headers=headers)

    print("Enviando notificacion push a %s, response text: %s, response code: %s" % (
        mails_to, response.text, response.status_code))


def send_push_notification_all(en_title, es_title, en_message, es_message):
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
