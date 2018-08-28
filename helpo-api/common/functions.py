from knox.models import AuthToken
from math import sin, cos, radians, acos

def get_token_user(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    objeto_token = AuthToken.objects.get(token_key=token[6:14])
    return objeto_token.user_id

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