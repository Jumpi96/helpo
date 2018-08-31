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
    print("Enviando mail a %s desde %s , response code: %s" %
          (mail_to, mail_from, response.status_code))
