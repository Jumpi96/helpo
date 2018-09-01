from decouple import config
import requests


def send_mail(mail_from="notificaciones@helpo.com.ar", mail_to="error@helpo.com.ar", subject="Error", html_content="Error"):
    url = "https://mail.zoho.com/api/accounts/%s/messages" % (
        config('ZOHO_ACCOUNT_ID'))
    payload = "{\n \"fromAddress\": \"%s\",\n \"toAddress\": \"%s\",\n \"subject\": \"%s\",\n \"content\": \"%s\"\n}" \
        % (mail_from, mail_to, subject, html_content)
    headers = {
        'Authorization': config('ZOHO_AUTH_TOKEN'),
        'Content-Type': "application/json"
    }

    response = requests.request("POST", url, data=payload, headers=headers)
    print("Enviando mail a %s desde %s, response code: %s" %
          (mail_to, mail_from, response.status_code))


def send_push_notification(en_title, es_title, en_message, es_message):
    url = "https://onesignal.com/api/v1/notifications"

    payload = "{\n " \
        "    \"app_id\": \"8dfa1a54-4fb2-42b3-97a6-70e004144dd5\",\n " \
        "   \"headings\": {\"en\": \"%s\", \"es\": \"%s\"},\n " \
        "   \"contents\": {\n   \t                \"en\": \"%s\",\n   \t " \
        "               \"es\": \"%s\",\n   \t                \"url\": \"https://www.helpo.com.ar\"\n " \
        "  \t\t\t\t},\n    \"include_player_ids\": [\"28631624-bddd-4bc4-8fcd-4c24b1dc00d9\"]\n}" \
        % (en_title, es_title, en_message, es_message)
    headers = {
        'Authorization': "Basic " + config('ONESIGNAL_REST_API_KEY'),
        'Content-Type': "application/json"
    }

    response = requests.request("POST", url, data=payload, headers=headers)

    print("Enviando notificacion push a 28631624-bddd-4bc4-8fcd-4c24b1dc00d9, response text: %s, response code: %s" % (
        response.text, response.status_code))


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
