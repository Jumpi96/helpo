from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from recommendations.services import get_data_fecha_regressor, train_fecha_regressor, predict_fechas, train_evento_recommendations
from common.functions import get_token_user

@api_view(['POST'])
def Train(request):
    try:
        #train_evento_recommendations()
        train_fecha_regressor()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def view_predict_fechas(request):
    try:
        ong = get_token_user(request)
        return Response(handle_predict_fechas(request.data, ong), status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)