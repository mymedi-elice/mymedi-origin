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
parser.add_argument('id')
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
Update API : 회원정보를 변경(정확히는 null값 채우기)
Delete API : 회원정보를 제거
"""

class UserInfo(Resource):
    def get(self, id=None):
        db_class = db.Database()
        # sql = "select * from `user_info`"
        # result = db_class.executeAll(sql)
        # return jsonify(status = 200, result = result)
        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        result = db_class.executeOne(sql, (id,))
        #username이 있을때
        if result:
            sql = "SELECT username, gender, birthday FROM `user_info` WHERE id = %s"
            info = db_class.executeAll(sql, (id,))
            sql = "SELECT id FROM `family_info` WHERE `user_info_id` = %s"
            family = db_class.executeOne(sql, (id,))
            # 가족정보가 존재할때
            if family:
                sql = "SELECT name, birthday, relationship_with_user, gender from `family_info` WHERE `user_info_id` = %s"
                family_info = db_class.executeAll(sql, (id,))
                # vaccine_sql = "SELECT get_vaccine from `get_vaccine` WHERE `family_info_id` = %s"
                # family_vaccine = db_class.executeAll(vaccine_sql, (family[0][0],))
                return jsonify(status = 200,
                # data = family_info)
                data = {"username": info[0]['username'], "birthday": info[0]['birthday'], "gender": info[0]['gender'],
                "family_info" : family_info})
            # 가족정보가 없을때
            else:
                return jsonify(status = 200, data = {"username": info[0]['username'], "birthday": info[0]['birthday'], "gender": info[0]['gender']})
        # username이 없을때
        else:
            return jsonify(status = 200, result = result) #null값

    def put(self, id):
        args = parser.parse_args()
        username = request.form['username']
        birthday = request.form['birthday']
        gender = request.form['gender']
        db_class = db.Database()
        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        result = db_class.executeOne(sql, (id,))
        # 회원정보 수정
        if result['username'] is None:
            sql = "UPDATE `user_info` SET username = %s, birthday = %s, gender = %s WHERE `id` = %s"
            db_class.execute(sql, (username, birthday, gender, id,))
            db_class.commit()
            return jsonify(status = "success",
            result = {"username": args['username'], "birthday": args["birthday"], "gender": args["gender"]})
        # else:
        #     sql = "SELECT id FROM `family_info` WHERE `user_info_id` = %s and name = %s"
        #     family = db_class.executeOne(sql, (id, args['family_name'],))
        #     # 가족정보가 존재할때 가족정보 수정
        #     if family:
        #         sql = "UPDATE `family_info` SET name = %s, birthday = %s, gender = %s, relationship_with_user = %s WHERE `id` = %s"

    def post(self, id):
        args = parser.parse_args()
        family_name = request.form['name']
        family_birthday = request.form['family_birthday']
        family_gender = request.form['family_gender']
        relationship_with_user = request.form['relationship_with_user']
        db_class = db.Database()
        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        result = db_class.executeOne(sql, (id,))
        # 가족 정보 insert
        if result:
            sql = "INSERT INTO `family_info` (name, birthday, relationship_with_user, gender, user_info_id) VALUES (%s, %s, %s, %s, %s)"
            db_class.execute(sql, (family_name, family_birthday,
            relationship_with_user, family_gender, id))
            db_class.commit

            return jsonify(status = "success",
            result = {"name": args['family_name'], "birthday": args["family_birthday"], "gender": args["family_gender"], "relationship_with_user" : args["relationship_with_user"]})

"""
GetVaccineInfo APIs - 백신접종 여부 CRUD

Read API : 백신접종 여부를 열람
Create API : 접종여부 등록
Update API : 업데이트
"""
parser.add_argument('vaccine')
parser.add_argument('get_date')

class GetVaccineInfo(Resource):
    def get(self, id=None, family_id=None):
        db_class = db.Database()
        if family_id:
            sql = "SELECT a.get_vaccine, b.name, a.get_date FROM `get_vaccine` as a JOIN `vaccine` as b ON a.vaccine_id = b.id WHERE a.family_info_id = %s"
            result = db_class.executeAll(sql, (family_id))
            return jsonify(status = 200, data = result)
        else:
            sql = "SELECT a.get_vaccine, b.name, a.get_date FROM `get_vaccine` as a JOIN `vaccine` as b ON a.vaccine_id = b.id WHERE a.user_info_id = %s"
            result = db_class.executeAll(sql, (id))
            return jsonify(status = 200, data = result)

    def post(self, id=None, family_id=None):
        db_class = db.Database()
        args = parser.parse_args()
        vaccine = request.form['vaccine']
        get_date = request.form['get_date']
        sql = "SELECT id from `vaccine` WHERE name = %s"
        vaccine_data = db_class.executeOne(sql, (vaccine))

        if family_id:
            sql = "INSERT INTO `get_vaccine` (get_date, family_info_id, vaccine_id) VALUES (%s, %s, %s)"
            db_class.execute(sql, (get_date, family_id, vaccine_data['id']))
            db_class.commit()

            return jsonify(status = "success",
            result = {"vaccine": args['vaccine'], "get_date": args["get_date"]})

        else:
            sql = "INSERT INTO `get_vaccine` (get_date, user_info_id, vaccine_id) VALUES (%s, %s, %s)"
            db_class.execute(sql, (get_date, id, vaccine_data['id']))
            db_class.commit()

            return jsonify(status = "success",
            result = {"vaccine": args['vaccine'], "get_date": args["get_date"]})


    def put(self, id=None, family_id=None):
        db_class = db.Database()
        args = parser.parse_args()
        vaccine = request.form['vaccine']
        get_date = request.form['get_date']
        sql = "SELECT id from `vaccine` WHERE name = %s"
        vaccine_data = db_class.executeOne(sql, (vaccine))

        if family_id:
            sql = "UPDATE `get_vaccine` set get_date=%s, vaccine_id=%s WHERE family_info_id=%s"
            db_class.execute(sql, (get_date, vaccine_data['id'], family_id))
            db_class.commit()

            return jsonify(status = "success",
            result = {"vaccine": args['vaccine'], "get_date": args["get_date"]})

        else:
            sql = "UPDATE `get_vaccine` set get_date=%s, vaccine_id=%s WHERE user_info_id=%s"
            db_class.execute(sql, (get_date, vaccine_data['id'], id))
            db_class.commit()

            return jsonify(status = "success",
            result = {"vaccine": args['vaccine'], "get_date": args["get_date"]})


api.add_resource(
    UserInfo,
    "/userinfo/<id>"
)

api.add_resource(
    GetVaccineInfo,
    "/userinfo/vaccine/<id>","/userinfo/vaccine/<id>/<family_id>"
)
