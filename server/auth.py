from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

# db
from module import db

# flask_jwt_extended를 사용하여 서버와 클라이언트 사이에서 토큰으로 인증
from flask_jwt_extended import create_access_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

CLIENT_ID = '391584993200-vq1qduetqntj6nngdks9intt5ha1s0f4.apps.googleusercontent.com'

auth = Blueprint("auth", __name__, url_prefix = '/auth')

parser_accessToken = reqparse.RequestParser()
parser_accessToken.add_argument('idToken')

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

    # 로그인한 사용자의 sub 정보를 db에 저장한다.
    db_class = db.Database()

    # 이미 등록된 사용자라면 db에 저장하지 않고, 등록되지 않은 유저라면 db에 저장
    sql = "SELECT id FROM user WHERE sub = %s"
    row = db_class.executeOne(sql, (sub))

    if row is None:
        sql = "INSERT INTO user (sub) VALUES (%s)"
        db_class.execute(sql, (sub,))
        db_class.commit()

    # 로그인한 사용자의 sub 정보를 기반으로 access token을 발급한다.
    access_token = create_access_token(identity = sub)

    return jsonify(status = "success", sub = sub, access_token = access_token)

# 로그인된 사용자에 대한 검증
@auth.route('/protected')
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as = current_user)
