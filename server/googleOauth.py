import os
import pathlib
import requests

from flask import Blueprint, jsonify, request, Flask, session, abort, redirect

# db
from module import db

# Google Oauth
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from pip._vendor import cachecontrol
import google.auth.transport.requests

from config import CLIENT_SECRET, CLIENT_ID

# flask_jwt_extended를 사용하여 서버와 클라이언트 사이에서 토큰으로 인증
# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import current_user
# from flask_jwt_extended import jwt_required
# from flask_jwt_extended import get_jwt_identity

googleOauth = Blueprint("googleOauth", __name__, url_prefix = "/googleOauth")

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# google client id, client secrets file
GOOGLE_CLIENT_ID = "391584993200-vq1qduetqntj6nngdks9intt5ha1s0f4.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file = client_secrets_file,
    scopes = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri = "http://localhost:3000/"
    )

def login_is_required(function):
    def wrapper(*args, **kwargs):
        if 'google_id' not in session:
            return abort(401) # Authorization required
        else:
            return function()
    return wrapper

@googleOauth.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    print("session 표시", session)

    return redirect(authorization_url)

GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

@googleOauth.route("/callback")
def callback():
    print("실행")
    # print(request.url)
    # flow.fetch_token(authorization_response = request.url)
    # flow.fetch_token(authorization_response = request.url)

    data = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'redirect_uri': "http://127.0.0.1:5000/",
            'code': request.args["access_code"],
            'grant_type': 'authorization_code',

    }

    response = requests.post(GOOGLE_TOKEN_ENDPOINT,data=data)
    print(response)
    # print(session['state'], request.args['state'])
    # if not session['state'] == request.args['state']:
    #     abort(500) # State does not match!

    # credentials = flow.credentials
    # print(credentials._id_token)
    # request_session = requests.session()
    # print(request_session)
    # cached_session = cachecontrol.CacheControl(request_session)
    # token_request = google.auth.transport.requests.Request(session = cached_session)

    # id_info = id_token.verify_oauth2_token(
    #     id_token = credentials._id_token,
    #     request = token_request,
    #     audience = GOOGLE_CLIENT_ID
    # )

    # session
    # session['google_id'] = id_info.get("sub")

    # # 구글 인증을 받은 사용자에게 sub, name 정보를 요청받는다.
    # sub = id_info.get("sub")
    # print(sub)

    # sub 값 지정해야합니다!!!
    # 사용자의 sub, name 정보를 db에 저장한다.
    db_class = db.Database()

    # 이미 등록된 유저라면 db에 저장하지 않는다.
    sql = "SELECT id FROM user WHERE sub = %s"
    row = db_class.executeOne(sql, (sub))

    # db에 등록되지 않은 유저라면 db에 저장
    if row is None:
        sql = "INSERT INTO user (sub) VALUES (%s)"
        db_class.execute(sql, (sub,))
        db_class.commit()

    # sub 정보를 기반으로 jwt access token을 발급한다.
    # access_token = create_access_token(identity = sub)

    # return redirect('/googleOauth/protected_area')
    return jsonify(status = 200)

    # 프론트에서 로그인한 사용자에 대한 access_token을 localStorage에 저장한다.
    # return jsonify(status = "success", result = {"name": name, "access_token": access_token})

# jwt token을 사용하는 경우 서버에서 token을 clear 해주지 않고,
# 프론트에서 localStorage에 저장된 access_token을 clear 해주는 방식으로 설정
@googleOauth.route('/logout')
def logout():
    session.clear()
    return jsonify(
        status = "success",
        message = "Logout Success!"
    )

# @googleOauth.route("/")
# def index():
#     return "Hello World <a href = '/googleOauth/login'><button>Login</button></a>"

@googleOauth.route("/protected_area")
@login_is_required
def protected_area():
    # current_user = get_jwt_identity()
    return "Protected! <a href = '/googleOauth/logout'><button>Logout</button></a>"
