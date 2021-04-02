from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from test import test
app.register_blueprint(test)

from auth import auth
app.register_blueprint(auth)

@app.route('/', methods = ['GET'])
def hello_world():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug = True)
