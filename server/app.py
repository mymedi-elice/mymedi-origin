from flask import Flask, session, abort, redirect, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.secret_key = "mymedi"
CORS(app)

# flask_jwt_extended를 위한 secret_key 설정
app.config["JWT_SECRET_KEY"] = "super-secret" # 나중에 config 파일에 넣어서 비공개로 설정
jwt = JWTManager(app)

from test import test
app.register_blueprint(test)

from auth import auth
app.register_blueprint(auth)

# from googleOauth import googleOauth
# app.register_blueprint(googleOauth)

if __name__ == "__main__":
    app.run(debug = True)
