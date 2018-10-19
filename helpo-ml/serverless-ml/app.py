from flask import Flask
from os import getenv

from routes.recommendations import RECOMMENDATIONS_API

app = Flask(__name__)

app.register_blueprint(RECOMMENDATIONS_API)

if __name__ == '__main__':    
    app.run(debug=getenv('debug', False), host='0.0.0.0')