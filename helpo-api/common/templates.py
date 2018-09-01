from django.template import loader, Context
import json


def render_verify_email(url_confirmation):
    template = loader.get_template('verify-email.html')
    dict_context = dict(action_url=url_confirmation)
    html_content = template.render(dict_context)
    json_content = json.dumps(html_content)
    return json_content
