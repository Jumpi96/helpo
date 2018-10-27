from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from recommendations.services import get_data_fecha_regressor

@api_view(['POST'])
def Train(request):
    #try:
    #train_evento_recommendations()
    #train_fecha_regressor()
    return Response(get_data_fecha_regressor()[0].to_json(), status=status.HTTP_204_NO_CONTENT)
    #except:
    #    return Response(status=status.HTTP_400_BAD_REQUEST)