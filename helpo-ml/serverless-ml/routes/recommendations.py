from managers.recommendations_manager import RecommendationsManager
from flask import Blueprint, request, Response
import numpy as np
import pandas as pd
import json
import pickle

RECOMMENDATIONS_API = Blueprint('recommendations', __name__)

RecommendationsManager = RecommendationsManager()


@RECOMMENDATIONS_API.route('/hello-world', methods=['GET'])
def hello_world():
    return json.dumps('Hello world!')


@RECOMMENDATIONS_API.route('/recommendations/predict_eventos', methods=['POST'])
def predict_eventos():    
    # Parse request body for model input 
    body_dict = request.get_json(silent=True)
    user = body_dict['user_id']
    eventos = body_dict['eventos']
    # Make prediction 
    predictions = RecommendationsManager.predict_eventos_userbased(user, eventos)
   
    return json.dumps(predictions)


@RECOMMENDATIONS_API.route('/recommendations/predict_fechas', methods=['POST'])
def predict_fechas():
    # Parse request body for model input
    body_dict = request.get_json(silent=True)
    prediction_data = body_dict['prediction_data']
    features = ['M', '%NecONG', '%NecR', '%VolONG', '%VolR', 'SuONG', 'SuR', 'VisONG', 'VisR', 'Dis', 'Dias']
    df = pd.DataFrame(columns=features, index=[0])
    df.loc[0] = pd.Series(prediction_data)
    # Make prediction 
    prediction = RecommendationsManager.predict_fecha(df)
    return json.dumps(prediction[0])