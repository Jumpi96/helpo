from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from recommendations.services import train

@api_view(['POST'])
def Train(request):
    try:
        return Response(request.data, status=status.HTTP_204_NO_CONTENT)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
