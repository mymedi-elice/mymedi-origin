from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

from config import CLIENT_ID

# db
from module import db

# flask_jwt_extended를 사용하여 서버와 클라이언트 사이에서 토큰으로 인증
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_refresh_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

auth = Blueprint("auth", __name__, url_prefix = '/auth')

parser_accessToken = reqparse.RequestParser()
parser_accessToken.add_argument('idToken')

# api url 주소와 idtoken 함수 이름 login으로 변경
@auth.route("/idtoken", methods = ['GET','POST'])
def idtoken():
    args = parser_accessToken.parse_args()
    idToken = args['idToken']
    # print(idToken)

    try:
        id_info = id_token.verify_oauth2_token(idToken, requests.Request(), CLIENT_ID)
        sub = id_info.get('sub')
        print(sub)

    except ValueError:
        return jsonify(status = "failure")

    # 로그인한 사용자의 sub 정보를 기반으로 access token을 발급한다.
    access_token = create_access_token(identity = sub)
    # access_token이 만료될 때, 이를 갱신해주기 위한 refresh token을 발급한다.
    refresh_token = create_refresh_token(identity = sub)

    # 로그인한 사용자의 sub 정보를 db에 저장한다.
    db_class = db.Database()

    # 이미 등록된 사용자라면 db에 저장하지 않고, 등록되지 않은 유저라면 db에 저장
    sql = "SELECT id FROM user WHERE sub = %s"
    row = db_class.executeOne(sql, (sub))

    if row is None:
        sql = "INSERT INTO user (sub) VALUES (%s)"
        db_class.execute(sql, (sub,))
        db_class.commit()

    return jsonify(
        status = "success",
        sub = sub,
        access_token = access_token,
        refresh_token = refresh_token
        )

# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@auth.route('/refresh', methods = ["POST"])
@jwt_required(refresh = True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity = identity)
    return jsonify(access_token = access_token)

# 로그인된 사용자에 대한 검증
@auth.route('/protected')
@jwt_required
def protected():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(status = "success", logged_in_as = current_user)
    else:
        return jsonify(status = "failure", error = "access_token is expired!")
