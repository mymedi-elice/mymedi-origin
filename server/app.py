from flask import Flask
from test import test

app = Flask(__name__)
app.register_blueprint(test)

@app.route('/', methods = ['GET'])
def hello_world():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug = True)
