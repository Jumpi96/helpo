import os
import pandas as pd
import numpy as np
import boto3
import pickle
import json
import requests
import datetime
from sklearn.neighbors import NearestNeighbors
from sklearn.svm import SVR
from decouple import config
from django.db.models import Sum
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, make_scorer
from surprise import Reader, Dataset, SVD
from surprise.model_selection import GridSearchCV
from recommendations.models import LogConsultaEvento
from actividades.models import Colaboracion, Participacion, Evento, Necesidad, Voluntario, \
    CategoriaRecurso, Funcion, RubroEvento
from users.models import User, Suscripcion
from common.functions import calc_distance_locations


bucket_name = 'helpo-ml'
model_evento = 'model_evento.pkl'
model_fecha = 'model_fecha.pkl'
features_fecha = 'features_fecha.pkl'
S3 = boto3.client(
        's3', region_name='us-west-2', 
        aws_access_key_id=config('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=config('AWS_SECRET_ACCESS_KEY')
    )

def handle_predict_fechas(data, ong):
    base = get_row_fecha_regressor(data, ong)
    predictions = predict_fechas(base)
    return {
      'Enero': predictions['1'],
      'Febrero': predictions['2'],
      'Marzo': predictions['3'],
      'Abril': predictions['4'],
      'Mayo': predictions['5'],
      'Junio': predictions['6'],
      'Julio': predictions['7'],
      'Agosto': predictions['8'],
      'Septiembre': predictions['9'],
      'Octubre': predictions['10'],
      'Noviembre': predictions['11'],
      'Diciembre': predictions['12']
    }


def predict_fechas(data):
    model = load_model(model_fecha)
    features = load_model(features_fecha)
    df = pd.DataFrame(columns=features, index=[0])
    df.loc[0] = pd.Series(data) 
    predictions = {}
    now = datetime.datetime.now()
    for i in range(12):
        df.loc[0]['M'] = i+1
        df.loc[0]['Dias'] = (datetime.datetime(
            now.year if i+1 >= now.month else now.year + 1,
            i+1, 15) - now).days
        pre = model.predict(df)
        predictions[str(i+1)] = round(pre[0], 4)
    return predictions


def predict_eventos_userbased(usuario, eventos):
    model = load_model(model_evento)
    ordered_dict = {}
    for evento in eventos:
        a = model.predict(usuario, evento)
        ordered_dict[evento] = round(a[3], 2)
    return sorted(ordered_dict.items(), key=lambda kv: kv[1], reverse=True)[:3]


def get_row_fecha_regressor(data, ong):
    organizacion = User.objects.get(id=ong)
    rubro_actividad = RubroEvento.objects.get(id=data['rubro_actividad'])
    base = {
        'M': 0,
        #'%NecONG': calc_porc_necesidades(ong=organizacion),
        #'%NecRO': calc_porc_necesidades(rubro_ong=organizacion.organizacionprofile.rubro),
        #'%NecRA': calc_porc_necesidades(rubro_act=rubro_actividad),
        #'%VolONG': calc_porc_voluntarios(ong=organizacion),
        #'%VolRO': calc_porc_voluntarios(rubro_ong=organizacion.organizacionprofile.rubro),
        #'%VolRA': calc_porc_voluntarios(rubro_act=rubro_actividad),
        'SuONG': len(Suscripcion.objects.filter(organizacion=organizacion)),
        'SuRO': len(Suscripcion.objects.filter(organizacion__organizacionprofile__rubro=organizacion.organizacionprofile.rubro)),
        'VisONG': calc_avg_visitas(ong=organizacion),
        'VisRO': calc_avg_visitas(rubro_ong=organizacion.organizacionprofile.rubro),
        'VisRA': calc_avg_visitas(rubro_act=rubro_actividad),
        'Dis': calc_distance_to_cordoba(data['ubicacion']),
        'Camp': 1 if data['campaña'] else 0,
        'Dias': 0
    }
    base = add_categorias_post(data['categorias_recurso'], base)
    base = add_funciones_post(data['categorias_recurso'], base)
    return base


def add_categorias_post(input_categorias, base):
    categorias = CategoriaRecurso.objects.all()
    for categoria in categorias:
        if categoria.id in input_categorias:
            base['C'+str(categoria.id)] = 1
        else:
            base['C'+str(categoria.id)] = 0
    return base


def add_funciones_post(input_funciones, base):
    funciones = Funcion.objects.all()
    for funcion in funciones:
        if funcion.id in input_funciones:
            base['F'+str(funcion.id)] = 1
        else:
            base['F'+str(funcion.id)] = 0
    return base


COLABORACION_MULTIPLIER = 5


def train_evento_recommendations():
    data = get_data_evento_recommendations()
    reader = Reader(rating_scale={0, max(data.rating)})
    trainset = Dataset.load_from_df(data[['userID', 'itemID', 'rating']], reader)
    
    param_grid = {'n_epochs': [1, 10, 50], 
              'lr_all': [0.85, 0.10, 0.11, 0.12],
              'reg_all': [0.01, 0.005, 0.003, 0.0001]}
    gs = GridSearchCV(SVD, param_grid, measures=['rmse', 'mae'], cv=6, refit=True)
    gs.fit(trainset)

    save_model_evento_recommendations(gs)
    

def get_data_evento_recommendations():
    usuarios = User.objects.all()
    eventos = Evento.objects.all()
    data = pd.DataFrame(columns=['userID', 'itemID', 'rating'])
    for usuario in usuarios:
        for evento in eventos:
            colaboro = len(Colaboracion.objects.filter(necesidad_material__evento=evento, colaborador=usuario)) > 0
            participo = len(Participacion.objects.filter(necesidad_voluntario__evento=evento, colaborador=usuario)) > 0
            organizador = evento.organizacion.id == usuario.id
            visitas = len(LogConsultaEvento.objects.filter(evento=evento, usuario=usuario))
            score = colaboro * COLABORACION_MULTIPLIER + \
                participo * COLABORACION_MULTIPLIER + visitas + \
                organizador * 2 * COLABORACION_MULTIPLIER
            if score > 0:
                data = data.append({
                    'userID': usuario.id,
                    'itemID': evento.id,
                    'rating': score
                }, ignore_index=True)
    return data


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


def load_model(key):
    # Load model from S3 bucket
    response = S3.get_object(Bucket=bucket_name, Key=key)
    # Load pickle model
    model_str = response['Body'].read()     
    return pickle.loads(model_str)


def save_model_evento_recommendations(model):
    model_obj = pickle.dumps(model)
    S3.put_object(Bucket=bucket_name, Key=model_evento, Body=model_obj)


def train_fecha_regressor():
    M, features = get_data_fecha_regressor()
    y = pd.DataFrame()
    y['pred'] = M['%Comp']
    training_data = M.drop(['%Comp'], axis=1)
    """
    rmse_error = make_scorer(mean_squared_error, greater_is_better=False)
    parameters = { 
        'C': [0.8, 0.9, 1],
        'epsilon': [0.04, 0.05, 0.06],
        'gamma': [0.001, 0.003, 0.005, 0.008]
    }
    svr = GridSearchCV(SVR(), cv=3, param_grid=parameters, scoring=rmse_error)
    """
    svr = SVR(gamma=0.008, epsilon=0.06, C=1)
    svr.fit(training_data, y)
    save_model_fecha_regressor(svr, features)


def get_data_fecha_regressor():
    eventos = Evento.objects.all()
    #features = ['M', '%NecONG', '%NecRO', '%NecRA', '%VolONG', '%VolRO', '%VolRA', 
    #    'SuONG', 'SuRO', 'VisONG', 'VisRO', 'VisRA', 'Dis', 'Dias', 'Camp']
    features = ['M', 'SuONG', 'SuRO', 'VisONG', 'VisRO', 'VisRA', 'Dis', 'Dias', 'Camp']
    features += get_necesidades_features()
    features.append('%Comp')
    df = pd.DataFrame(columns=features, index=[str(evento.id) for evento in eventos])
    for evento in eventos:
        dict_evento = {
            'M': evento.fecha_hora_inicio.month,
            #'%NecONG': calc_porc_necesidades(ong=evento.organizacion),
            #'%NecRO': calc_porc_necesidades(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            #'%NecRA': calc_porc_necesidades(rubro_act=evento.rubro),
            #'%VolONG': calc_porc_voluntarios(ong=evento.organizacion),
            #'%VolRO': calc_porc_voluntarios(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            #'%VolRA': calc_porc_voluntarios(rubro_act=evento.rubro),
            'SuONG': len(Suscripcion.objects.filter(organizacion=evento.organizacion)),
            'SuRO': len(Suscripcion.objects.filter(organizacion__organizacionprofile__rubro=evento.organizacion.organizacionprofile.rubro)),
            'VisONG': calc_avg_visitas(ong=evento.organizacion),
            'VisRO': calc_avg_visitas(rubro_ong=evento.organizacion.organizacionprofile.rubro),
            'VisRA': calc_avg_visitas(rubro_act=evento.rubro),
            'Dis': calc_distance_to_cordoba(evento.organizacion),
            'Dias': (evento.fecha_hora_inicio - evento.created).days,
            'Camp': 1 if evento.campaña else 0
        }
        dict_evento = add_categorias(evento, dict_evento)
        dict_evento = add_funciones(evento, dict_evento)
        dict_evento['%Comp'] = calc_porc_total_evento(evento)
        df.loc[str(evento.id)] = pd.Series(dict_evento)
    return df, features[:-1]


def get_necesidades_features():
    necesidades_features = []
    categorias = CategoriaRecurso.objects.all()
    for categoria in categorias:
        necesidades_features.append('C'+str(categoria.id))
    funciones = Funcion.objects.all()
    for funcion in funciones:
        necesidades_features.append('F'+str(funcion.id))
    return necesidades_features


def add_categorias(evento, dict_evento):
    categorias = CategoriaRecurso.objects.all()
    for categoria in categorias:
        if len(Necesidad.objects.filter(recurso__categoria=categoria, evento=evento)) > 0:
            dict_evento['C'+str(categoria.id)] = 1
        else:
            dict_evento['C'+str(categoria.id)] = 0
    return dict_evento

def add_funciones(evento, dict_evento):
    funciones = Funcion.objects.all()
    for funcion in funciones:
        if len(Voluntario.objects.filter(funcion=funcion, evento=evento)) > 0:
            dict_evento['F'+str(funcion.id)] = 1
        else:
            dict_evento['F'+str(funcion.id)] = 0
    return dict_evento



def save_model_fecha_regressor(model, features):
    model_obj = pickle.dumps(model)
    features_obj = pickle.dumps(features)
    
    S3.put_object(Bucket=bucket_name, Key=model_fecha, Body=model_obj)
    S3.put_object(Bucket=bucket_name, Key=features_fecha, Body=features_obj)


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
            if colaboraciones:
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
            if participaciones:
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
        if colaboraciones:
            cubiertas += colaboraciones.aggregate(Sum('cantidad'))['cantidad__sum']
    voluntarios = Voluntario.objects.filter(evento=evento)
    for voluntario in voluntarios:
        cantidad += voluntario.cantidad
        participaciones = Participacion.objects.filter(necesidad_voluntario=voluntario, vigente=True)
        if participaciones:
            cubiertas += participaciones.aggregate(Sum('cantidad'))['cantidad__sum']
    if cantidad > 0:
        return cubiertas/cantidad
    else:
        return 0