import os
import pandas as pd
import numpy as np
import boto3
from sklearn.metrics import pairwise_distances
from sklearn.metrics import mean_squared_error
from sklearn.neighbors import NearestNeighbors
from sklearn.externals import joblib
from decouple import config

from recommendations.models import LogConsultaEvento
from actividades.models import Colaboracion, Participacion, Evento
from users.models import User

COLABORACION_MULTIPLIER = 5

def train_evento_recommendations():
    M = get_data_evento_recommendations()
    model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute') 
    model_knn.fit(M)
    save_model_evento_recommendations(model_knn)
    

def get_data_evento_recommendations():
    usuarios = User.objects.exclude(user_type=1)
    eventos = Evento.objects.all()
    df = pd.DataFrame(columns=[str(evento.id) for evento in eventos],
        index=[str(usuario.id) for usuario in usuarios])
    for usuario in usuarios:
        dict_usuario = {}
        for evento in eventos:
            colaboro = len(Colaboracion.objects.filter(necesidad_material__evento=evento, colaborador=usuario)) > 0
            participo = len(Participacion.objects.filter(necesidad_voluntario__evento=evento, colaborador=usuario)) > 0
            visitas = len(LogConsultaEvento.objects.filter(evento=evento, usuario=usuario))
            score = colaboro * COLABORACION_MULTIPLIER + participo * COLABORACION_MULTIPLIER + visitas
            dict_usuario[str(evento.id)] = score
            #print(usuario.nombre + ' - ' + evento.nombre + ' - Score: ' + str(score))
        df.loc[str(usuario.id)] = pd.Series(dict_usuario)
    return df
    
def save_model_evento_recommendations(model):
    file_name = 'model_evento.pkl'
    local_file = 'model_evento_{}.pkl'.format(str(np.datetime64('now')))
    joblib.dump(model, local_file)
    S3 = boto3.client(
        's3', region_name='us-west-2', 
        aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY')
    )
    bucket = 'helpo-ml'
    S3.upload_file(local_file, bucket, file_name)
    os.remove(local_file)