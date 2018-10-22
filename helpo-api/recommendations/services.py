import os
import pandas as pd
import numpy as np
import boto3
import pickle
from sklearn.metrics import pairwise_distances
from sklearn.metrics import mean_squared_error
from sklearn.neighbors import NearestNeighbors
from sklearn.svm import SVR
from decouple import config
from django.db.models import Sum
from sklearn import preprocessing
from sklearn.model_selection import GridSearchCV

from recommendations.models import LogConsultaEvento
from actividades.models import Colaboracion, Participacion, Evento, Necesidad, Voluntario
from users.models import User, Suscripcion
from common.functions import calc_distance_locations

COLABORACION_MULTIPLIER = 5

def train_evento_recommendations():
    M = get_data_evento_recommendations()
    model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute') 
    model_knn.fit(M)
    save_model_evento_recommendations(model_knn, M)
    

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
            print(usuario.nombre + ' - ' + evento.nombre + ' - Score: ' + str(score))
        df.loc[str(usuario.id)] = pd.Series(dict_usuario)
    return df


def get_row_evento_recommendations(usuario):
    eventos = Evento.objects.all()
    dict_usuario = {}
    for evento in eventos:
        colaboro = len(Colaboracion.objects.filter(necesidad_material__evento=evento, colaborador_id=usuario)) > 0
        participo = len(Participacion.objects.filter(necesidad_voluntario__evento=evento, colaborador_id=usuario)) > 0
        visitas = len(LogConsultaEvento.objects.filter(evento=evento, usuario_id=usuario))
        score = colaboro * COLABORACION_MULTIPLIER + participo * COLABORACION_MULTIPLIER + visitas
        dict_usuario[str(evento.id)] = score
        print(usuario.nombre + ' - ' + evento.nombre + ' - Score: ' + str(score))
    return dict_usuario


def save_model_evento_recommendations(model, scores):
    model_file = 'model_evento.pkl'
    scores_file = 'scores_evento.pkl'
    model_obj = pickle.dumps(model)
    scores_obj = pickle.dumps(scores)
    S3 = boto3.client(
        's3', region_name='us-west-2', 
        aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY')
    )
    bucket = 'helpo-ml'
    S3.put_object(Bucket=bucket, Key=model_file, Body=model_obj)
    S3.put_object(Bucket=bucket, Key=scores_file, Body=scores_obj)


def train_fecha_regressor():
    M, features = get_data_fecha_regressor()
    y = pd.DataFrame()
    y["pred"] = M["%Comp"]
    training_data = M.drop(["%Comp"], axis=1)
    training_data = preprocessing.scale(training_data)

    parameters = {
        'kernel': ('linear', 'rbf','poly'), 
        'C': np.linspace(0.1, 1, num=5),
        'gamma': np.linspace(1e-11,1e-9, num=5),
        'epsilon': np.linspace(1e-11, 1e-9, num=5)
    }
    svr = GridSearchCV(SVR(), cv=2, param_grid=parameters)
    svr.fit(training_data, y)

    #print(svr.best_estimator_)
    print(svr.predict(training_data))
    #save_model_fecha_regressor(svr, features)


def get_data_fecha_regressor():
    eventos = Evento.objects.all()
    features = ['M', '%NecONG', '%NecRO', '%NecRA', '%VolONG', '%VolRO', '%VolRA', 'SuONG', 'SuRO', 'VisONG', 'VisRO', 'VisRA', 'Dis', 'Dias', 'Camp', '%Comp']
    df = pd.DataFrame(columns=features, index=[str(evento.id) for evento in eventos])
    for evento in eventos:
        dict_evento = {
            'M': evento.fecha_hora_inicio.month,
            '%NecONG': calc_porc_necesidades(ong=evento.organizacion),
            '%NecRO': calc_porc_necesidades(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            '%NecRA': calc_porc_necesidades(rubro_act=evento.rubro),
            '%VolONG': calc_porc_voluntarios(ong=evento.organizacion),
            '%VolRO': calc_porc_voluntarios(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            '%VolRA': calc_porc_voluntarios(rubro_act=evento.rubro),
            'SuONG': len(Suscripcion.objects.filter(organizacion=evento.organizacion)),
            'SuRO': len(Suscripcion.objects.filter(organizacion__organizacionprofile__rubro=evento.organizacion.organizacionprofile.rubro)),
            'VisONG': calc_avg_visitas(ong=evento.organizacion),
            'VisRO': calc_avg_visitas(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            'VisRA': calc_avg_visitas(rubro_act=evento.rubro),
            'Dis': calc_distance_to_cordoba(evento.organizacion),
            'Dias': (evento.fecha_hora_inicio - evento.created).days,
            'Camp': 1 if evento.campaña else 0,
            '%Comp': calc_porc_total_evento(evento)
        }
        df.loc[str(evento.id)] = pd.Series(dict_evento)
        print(df.loc[str(evento.id)])
    return df, features[:-1]


def get_row_fecha_regressor(evento_id):
    evento = Evento.objects.get(id=evento_id)
    return {
        'M': evento.fecha_hora_inicio.month,
        '%NecONG': calc_porc_necesidades(ong=evento.organizacion),
        '%NecRO': calc_porc_necesidades(rubro_ong=evento.organizacion.organizacionprofile.rubro),
        '%NecRA': calc_porc_necesidades(rubro_act=evento.rubro),
        '%VolONG': calc_porc_voluntarios(ong=evento.organizacion),
        '%VolRO': calc_porc_voluntarios(rubro_ong=evento.organizacion.organizacionprofile.rubro),
        '%VolRA': calc_porc_voluntarios(rubro_act=evento.rubro),
        'SuONG': len(Suscripcion.objects.filter(organizacion=evento.organizacion)),
        'SuRO': len(Suscripcion.objects.filter(organizacion__organizacionprofile__rubro=evento.organizacion.organizacionprofile.rubro)),
        'VisONG': calc_avg_visitas(ong=evento.organizacion),
        'VisRO': calc_avg_visitas(rubro_ong=evento.organizacion.organizacionprofile.rubro),
        'VisRA': calc_avg_visitas(rubro_act=evento.rubro),
        'Dis': calc_distance_to_cordoba(evento.organizacion),
        'Dias': (evento.fecha_hora_inicio - evento.created).days,
        'Camp': 1 if evento.campaña else 0
    }


def save_model_fecha_regressor(model, features):
    model_file = 'model_fecha.pkl'
    model_obj = pickle.dumps(model)
    features_file = 'features_fecha.pkl'
    features_obj = pickle.dumps(features)
    S3 = boto3.client(
        's3', region_name='us-west-2', 
        aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY')
    )
    bucket = 'helpo-ml'
    S3.put_object(Bucket=bucket, Key=model_file, Body=model_obj)
    S3.put_object(Bucket=bucket, Key=features_file, Body=features_obj)


def calc_porc_necesidades(ong=0, rubro_ong=0, rubro_act=0):
    if ong != 0:
        necesidades = Necesidad.objects.filter(evento__organizacion=ong)
    elif rubro_ong != 0:
        necesidades = Necesidad.objects.filter(evento__organizacion__organizacionprofile__rubro=rubro_ong)
    else:
        necesidades = Necesidad.objects.filter(evento__rubro=rubro_act)
    cantidad, cubiertas = 0, 0
    if necesidades:
        for necesidad in necesidades:
            cantidad += necesidad.cantidad
            colaboraciones = Colaboracion.objects.filter(necesidad_material=necesidad, vigente=True)
            cubiertas += colaboraciones.aggregate(Sum('cantidad'))['cantidad__sum']
        return cubiertas/cantidad
    else:
        return 0


def calc_porc_voluntarios(ong=0, rubro_ong=0, rubro_act=0):
    if ong != 0:
        voluntarios = Voluntario.objects.filter(evento__organizacion=ong)
    elif rubro_ong != 0:
        voluntarios = Voluntario.objects.filter(evento__organizacion__organizacionprofile__rubro=rubro_ong)
    else:
        voluntarios = Voluntario.objects.filter(evento__rubro=rubro_act)
    cantidad, cubiertos = 0, 0
    if voluntarios:
        for voluntario in voluntarios:
            cantidad += voluntario.cantidad
            participaciones = Participacion.objects.filter(necesidad_voluntario=voluntario, vigente=True)
            cubiertos += participaciones.aggregate(Sum('cantidad'))['cantidad__sum']
        return cubiertos/cantidad
    else:
        return 0


def calc_avg_visitas(ong=0, rubro_act=0, rubro_ong=0):
    if ong != 0:
        eventos = Evento.objects.filter(organizacion=ong)
    elif rubro_ong != 0:
        eventos = Evento.objects.filter(organizacion__organizacionprofile__rubro=rubro_ong)
    else:
        eventos = Evento.objects.filter(rubro=rubro_act)
    if eventos:
        contador = 0
        for evento in eventos:
            contador += len(LogConsultaEvento.objects.filter(evento=evento))
        return contador/len(eventos)
    else:
        return 0


def calc_distance_to_cordoba(ong):
    try:
        ong_ubicacion = ong.organizacionprofile.ubicacion
        return calc_distance_locations(            
            ong_ubicacion.latitud,
            ong_ubicacion.longitud,
            -31.4201, 
            -64.1888
        )
    except Exception:
        return 0


def calc_porc_total_evento(evento):
    cantidad, cubiertas = 0, 0
    necesidades = Necesidad.objects.filter(evento=evento)
    for necesidad in necesidades:
        cantidad += necesidad.cantidad
        colaboraciones = Colaboracion.objects.filter(necesidad_material=necesidad, vigente=True)
        cubiertas += colaboraciones.aggregate(Sum('cantidad'))['cantidad__sum']
    voluntarios = Voluntario.objects.filter(evento=evento)
    for voluntario in voluntarios:
        cantidad += voluntario.cantidad
        participaciones = Participacion.objects.filter(necesidad_voluntario=voluntario, vigente=True)
        cubiertas += participaciones.aggregate(Sum('cantidad'))['cantidad__sum']
    if cantidad > 0:
        return cubiertas/cantidad
    else:
        return 0