from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

from config import CLIENT_ID

# db
from module import db

user_info = Blueprint("userinfo", __name__)
api = Api(user_info)

parser = reqparse.RequestParser()
parser.add_argument('sub')
parser.add_argument('username')
parser.add_argument('gender')
parser.add_argument('birthday')

parser.add_argument('family_name')
parser.add_argument('family_gender')
parser.add_argument('family_birthday')
parser.add_argument('relationship_with_user')

"""
UserInfo APIs - 회원정보 CRUD

Read API : 회원정보를 열람
Create API : 가족 구성원의 관계, 이름, 생일, 성별을 입력받아 가족정보에 새로운 가족을 입력
Update API : 회원정보를 변경
Delete API : 회원정보를 제거
"""

class UserInfo(Resource):
    def get(self, sub=None):
        db_class = db.Database()
        # sql = "select * from `user_info`"
        # result = db_class.executeAll(sql)
        # return jsonify(status = 200, result = result)
        sql = "SELECT username FROM `user_info` WHERE `sub` = %s"
        result = db_class.executeOne(sql, (sub,))
        if result:
            sql = "SELECT username, gender, birthday FROM `user_info` WHERE `sub` = %s"
            info = db_class.executeAll(sql, (sub,))
            sql = "SELECT id FROM `family_info` WHERE `user_sub` = %s"
            family = db_class.executeOne(sql, (sub,))
            if family:
                sql = "SELECT name, birthday, relationship_with_user, gender from `family_info` WHERE `user_sub` = %s"
                family_info = db_class.executeAll(sql, (sub,))
                return jsonify(status = 200, result = family_info)
            else:
                return jsonify(status = 200, result = info)
        else:
            return jsonify(status = 200, result = result)

    def put(self, sub=None):
        args = parser.parse_args()
        db_class = db.Database()
        sql = "SELECT username FROM `user_info` WHERE `sub` = %s"
        result = db_class.executeOne(sql, (sub,))
        if result is None:
            sql = "UPDATE `user_info` SET username = %s, birthday = %s, gender = %s WHERE `sub` = %s"
            db_class.execute(sql, (args['username'], args["birthday"], args["gender"], args["sub"]))
            db_class.commit

            return jsonify(status = "success",
            result = {"username": args['username'], "birthday": args["birthday"], "gender": args["gender"]})

    def post(self, sub):
        args = parser.parse_args()
        db_class = db.Database()
        sql = "SELECT username FROM `user_info` WHERE `sub` = %s"
        result = db_class.executeOne(sql, (sub,))
        if result:
            sql = "CREATE `family_info` SET name = %s, birthday = %s, relationship_with_user = %s, gender = %s WHERE `sub` = %s"
            db_class.execute(sql, (args['family_name'], args["family_birthday"],
            args["family_gender"], args["relationship_with_user"], args["sub"]))
            db_class.commit

            return jsonify(status = "success",
            result = {"name": args['family_name'], "birthday": args["family_birthday"], "gender": args["family_gender"], "relationship_with_user" : args["relationship_with_user"]})

api.add_resource(
    UserInfo,
    "/userinfo/<sub>"
)
