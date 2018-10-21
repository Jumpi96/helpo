from managers.recommendations_manager import RecommendationsManager
from flask import Blueprint, request, Response
import numpy as np
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

