from knox.models import AuthToken
from math import sin, cos, radians, acos
import requests


EARTH_RADIUS_IN_KMS = 6371.009


def calc_distance_locations(lat_a, long_a, lat_b, long_b):
    lat_a = radians(lat_a)
    lat_b = radians(lat_b)
    delta_long = radians(long_a - long_b)
    cos_x = (
        sin(lat_a) * sin(lat_b) +
        cos(lat_a) * cos(lat_b) * cos(delta_long)
    )
    return acos(cos_x) * EARTH_RADIUS_IN_KMS


def get_token_user(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if token is not None and len(token) > 0:
        objeto_token = AuthToken.objects.get(token_key=token[6:14])
        return objeto_token.user_id


def get_datos_token_google(token):
    if token is not None:
        r = requests.get(
            'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=%s' % (token))
        if r.status_code == 200:
            json = r.json()
            email = json.get("email")
            nombre = json.get("given_name")
            apellido = json.get("family_name")
            foto = json.get("picture")
            return {
                'email': email,
                'nombre': nombre,
                'apellido': apellido,
                'foto': foto
            }
    return None


def get_datos_token_facebook(token):
    if token is not None:
        r = requests.get(
            'https://graph.facebook.com/me?access_token=%s' % (token))
        if r.status_code == 200:
            json = r.json()
            name = json.get("name")
            return name
    return None
