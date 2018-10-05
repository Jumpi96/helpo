from django.template import loader, Context


def render_verify_email(url_confirmation):
    dict_context = dict(action_url=url_confirmation)
    return render_mail('verify-email.html', dict_context)


def render_colaboracion_email(evento, colaboracion, titulo_email):
    dict_context = dict(
        evento=evento, colaboracion=colaboracion, titulo=titulo_email)
    return render_mail('colaboracion-email.html', dict_context)


def render_participacion_email(participacion, titulo_email):
    dict_context = dict(participacion=participacion, titulo=titulo_email)
    return render_mail('participacion-email.html', dict_context)

def render_creacion_evento_email(evento):
    dict_context = dict(evento=evento)
    return render_mail('creacion-evento-email.html', dict_context)

def render_cambio_evento_email(evento):
    dict_context = dict(evento=evento)
    return render_mail('cambio-evento-email.html', dict_context)

def render_propuesta(propuesta):
    dict_context = dict(propuesta=propuesta)
    return render_mail('propuesta.html', dict_context)

def render_respuesta_propuesta(propuesta):
    if propuesta.aceptado == 1:
        respuesta = '<b style="color:#1fc654">Aceptada</b>'
    else:
        respuesta = '<b style="color:#ff0000">Rechazada</b>'
    dict_context = dict(propuesta=propuesta, respuesta=respuesta)
    return render_mail('respuesta-propuesta.html', dict_context)

def render_mensaje_evento(evento, mensaje):
    dict_context = dict(
        mensaje=mensaje,
        evento_nombre=evento.nombre,
        organizacion=evento.organizacion.nombre
    )
    return render_mail('mensaje-evento.html', dict_context)


def render_full_participacion_email(necesidad_voluntario):
    dict_context = dict(
        voluntario=necesidad_voluntario
    )
    return render_mail('full-participacion-email.html', dict_context)


def render_was_full_participacion_email(necesidad_voluntario):
    dict_context = dict(
        voluntario=necesidad_voluntario
    )
    return render_mail('was-full-participacion-email.html', dict_context)


def render_full_colaboracion_email(necesidad_material):
    dict_context = dict(
        necesidad=necesidad_material
    )
    return render_mail('full-colaboracion-email.html', dict_context)


def render_was_full_colaboracion_email(necesidad_material):
    dict_context = dict(
        necesidad=necesidad_material
    )
    return render_mail('was-full-colaboracion-email.html', dict_context)


def render_inicio_evento_email(evento):
    dict_context = dict(
        evento=evento,
        action_url="https://www.helpo.com.ar/#/redirect/evento?id=" + str(evento.id)
    )
    return render_mail('inicio-evento-email.html', dict_context)


def render_fin_evento_email(evento):
    dict_context = dict(
        evento=evento,
        action_url="https://www.helpo.com.ar/#/redirect/evento?id=" + str(evento.id)
    )
    return render_mail('fin-evento-email.html', dict_context)


def render_mail(html_template, dict_context):
    template = loader.get_template(html_template)
    html_content = template.render(dict_context)
    return html_content
