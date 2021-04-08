from datetime import timedelta
from flask import Flask, session, abort, redirect, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import JWT_SECRET_KEY

app = Flask(__name__)
app.secret_key = "mymedi"
CORS(app, origins = ['http://localhost:3000'])

# flask_jwt_extended를 위한 secret_key 설정
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY # 나중에 config 파일에 넣어서 비공개로 설정
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours = 1)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days = 30)
jwt = JWTManager(app)

from test import test
app.register_blueprint(test)

from auth import auth
app.register_blueprint(auth)

from googleOauth import googleOauth
app.register_blueprint(googleOauth)

# from googleCalendar import googleCalendar
# app.register_blueprint(googleCalendar)

if __name__ == "__main__":
    app.run(debug = True)
