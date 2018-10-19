from managers.recommendations_manager import RecommendationsManager
from flask import Blueprint, request, Response
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
    data = body_dict['data']     
    
    # Load model
    model = RecommendationsManager.load_model(MODEL_FILE_NAME)
    # Make prediction 
    prediction = model.predict(data).tolist()
    # Respond with prediction result
    result = {'prediction': prediction}    
   
    return json.dumps(result)

