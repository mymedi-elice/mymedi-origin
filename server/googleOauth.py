import os
import pathlib
import requests
import urllib.parse

from flask_restful import reqparse
from flask import Blueprint, jsonify, request, Flask, redirect

# flask_jwt_extended를 사용하여 서버와 클라이언트 사이에서 토큰으로 인증
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

# Google Oauth
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
import google.auth.transport.requests

# db
from module import db

from config import CLIENT_SECRET, CLIENT_ID, CLIENT_SECRETS_FILE, REDIRECT_URI

# Blueprint 설정
googleOauth = Blueprint("googleOauth", __name__, url_prefix = "/googleOauth")

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Google Oauth client secrets file
client_secrets_file = CLIENT_SECRETS_FILE

# Google Oauth Endpoint
GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
GOOGLE_ID_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/tokeninfo'
GOOGLE_USER_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo'

# Google Oauth2.0 Authorization grant type
# authorization_url을 발급받기 위한 flow 설정
flow = Flow.from_client_secrets_file(
    client_secrets_file = client_secrets_file,
    scopes = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.readonly", 'openid'],
    redirect_uri = REDIRECT_URI
    )

# Google Oauth로 로그인을 하기 위한 authorization_url로 이동
@googleOauth.route("/login")
def login():
    authorization_url, state = flow.authorization_url(
        access_type = "offline",
        include_granted_scopes = 'true'
    )
    print('authorization_url: ', authorization_url)
    return redirect(authorization_url)

# authorization으로 이동해서 google로 로그인하면
# redirect_url로 이동하게 되고 authorization_code를 포함한
# url을 server의 callback 주소로 post 요청

parser_url = reqparse.RequestParser()
parser_url.add_argument('url')

@googleOauth.route('/callback')
def callback():

    # authorization_code를 얻기 위한 url 전처리
    args = parser_url.parse_args()
    url = args['url']
    split_url = url.split("?")[1]
    split_again = split_url.split("&")
    parsed_url = urllib.parse.parse_qs(split_url)
    authorization_code = parsed_url['code'][0]

    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
        'code': authorization_code,
        'grant_type': 'authorization_code',
    }

    # authorization_code를 id_token, access_token으로 변경
    response = requests.post(GOOGLE_TOKEN_ENDPOINT, data = data)
    response_json = response.json()
    google_access_token = response_json['access_token'] # google refresh 토큰을 발급받기 위함
    google_id_token = response_json['id_token']

    # id_token을 이용해서 Google User의 sub, email 받아오기
    id_info = requests.get(GOOGLE_ID_TOKEN_ENDPOINT, params = {'id_token': google_id_token}).json()

    # Specify the CLIENT_ID of the app that accesses the backend:
    if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        raise ValueError('Wrong issuer.')

    if id_info['aud'] != CLIENT_ID:
        raise ValueError('Wrong aud {}. It have to be {}.'.format(id_info['aud'], CLIENT_ID))

    if not id_info['email_verified']:
        raise ValueError('Email is not verified.')

    sub = id_info['sub']
    email = id_info['email']
    country = id_info['locale']

    # 로그인한 사용자의 sub를 기반으로 jwt access token 발급
    access_token = create_access_token(identity = sub)

    # access_token이 만료될 때, 이를 갱신해주기 위한 refresh token 발급
    refresh_token = create_refresh_token(identity = sub)

    # 로그인한 사용자의 sub 정보를 db에 저장한다.
    db_class = db.Database()

    # 이미 등록된 사용자라면 db에 저장하지 않고, 등록되지 않은 유저라면 db에 저장
    sql = "SELECT id FROM user WHERE sub = %s"
    row = db_class.executeOne(sql, (sub))

    if row is None:
        sql = "INSERT INTO user (sub, email, country) VALUES (%s, %s, %s)"
        db_class.execute(sql, (sub, email, country))
        db_class.commit()
        return jsonify(
            status = 200,
            sub = sub,
            access_token = access_token,
            refresh_token = refresh_token,
            user = True # 이 사이트에 처음 로그인한 사용자
        )
    else:
        return jsonify(
            status = 200,
            sub = sub,
            access_token = access_token,
            refresh_token = refresh_token,
            user = False # 이 사이트에 접속한 내역이 있는 사용자
        )


# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@googleOauth.route('/refresh', methods = ["POST"])
@jwt_required(refresh = True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity = identity)
    return jsonify(
        status = 200,
        access_token = access_token
    )

# 로그인된 사용자에 대한 검증
@googleOauth.route('/protected')
@jwt_required
def protected():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(
            status = 200,
            logged_in_as = current_user
        )
    else:
        return jsonify(
            status = 400,
            error = "access_token is expired!"
        )
