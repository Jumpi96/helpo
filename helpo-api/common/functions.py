from knox.models import AuthToken

def get_token_user(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    objeto_token = AuthToken.objects.get(token_key=token[6:14])
    return objeto_token.user_id