def load_model(key):    
    # Load model from S3 bucket
    response = S3.get_object(Bucket=BUCKET_NAME, Key=key)
    # Load pickle model
    model_str = response['Body'].read()     
    model = pickle.loads(model_str)     
    
    return model