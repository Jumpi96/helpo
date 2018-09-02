from django.template import loader, Context


def render_verify_email(url_confirmation):
    dict_context = dict(action_url=url_confirmation)
    return render_mail('verify-email.html', dict_context)


def render_colaboracion_email(evento, colaboracion, titulo_email):
    dict_context = dict(evento=evento, colaboracion=colaboracion, titulo=titulo_email)
    return render_mail('colaboracion-email.html', dict_context)


def render_mail(html_template, dict_context):
    template = loader.get_template(html_template)
    html_content = template.render(dict_context)
    return html_content
