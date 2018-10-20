import boto3
from os import getenv
import pickle

BUCKET_NAME = 'helpo-ml'
MODEL_FILE_NAME = 'model_evento.pkl'


class RecommendationsManager(object):

    def __init__(self):
        self.S3 = boto3.client(
            's3', region_name='us-west-2', 
            aws_access_key_id=getenv('aws_access_key_id'),
            aws_secret_access_key=getenv('aws_secret_access_key')
        )

    def load_model(key):
        # Load model from S3 bucket
        response = S3.get_object(Bucket=BUCKET_NAME, Key=key)
        # Load pickle model
        model_str = response['Body'].read()     
        return pickle.loads(model_str)