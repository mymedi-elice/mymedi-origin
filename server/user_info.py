from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

from config import CLIENT_ID

# db
from module.db import connection_pool

user_info = Blueprint("userinfo", __name__)
api = Api(user_info)

parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('username')
parser.add_argument('gender')
parser.add_argument('birthday')
parser.add_argument('vaccine')

parser.add_argument('family_name')
parser.add_argument('family_gender')
parser.add_argument('family_birthday')
parser.add_argument('relationship_with_user')
parser.add_argument('family_vaccine')
parser.add_argument('get_date')

"""
UserInfo APIs - 회원정보 CRUD

Read API : 회원정보를 열람
Create API : 가족 구성원의 관계, 이름, 생일, 성별을 입력받아 가족정보에 새로운 가족을 입력
Update API : 회원정보를 변경(정확히는 null값 채우기)
Delete API : 회원정보를 제거
"""

class UserInfo(Resource):
    def get(self, id=None):
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        cursor.execute(sql, (id,))
        result = cursor.fetchone()
        print(result)
        #username이 있을때
        if result:
            sql = "SELECT username, gender, birthday FROM `user_info` WHERE id = %s"
            cursor.execute(sql, (id,))
            info = cursor.fetchone()
            user_vaccine_sql = "SELECT b.name from `get_vaccine` as a JOIN `vaccine` as b ON a.vaccine_id = b.id WHERE a.user_info_id = %s and a.get_vaccine = 1"
            cursor.execute(user_vaccine_sql, (id,))
            user_vaccine = cursor.fetchall()
            vac = []
            for i in user_vaccine:
                vac.append(i[0])
            sql = "SELECT id FROM `family_info` WHERE `user_info_id` = %s"
            cursor.execute(sql, (id,))
            family = cursor.fetchall()
            # 가족정보가 존재할때
            if family:
                family_info_list = []
                for i in range(len(family)):
                    sql = "SELECT name, birthday, relationship_with_user, gender from `family_info` WHERE `id` = %s"
                    cursor.execute(sql, (family[i][0],))
                    family_info = cursor.fetchone()
                    print(family_info)
                    vaccine_sql = "SELECT b.name from `get_vaccine` as a JOIN `vaccine` as b ON a.vaccine_id = b.id WHERE a.family_info_id = %s and a.get_vaccine = 1"
                    cursor.execute(vaccine_sql, (family[i][0],))
                    family_vaccine = cursor.fetchall()
                    f_vac = []
                    for i in family_vaccine:
                        f_vac.append(i[0])
                    family_info_tuple = {"name": family_info[0],  "birth":family_info[1], "relationship":family_info[2], "gender":family_info[3],
                    "vaccine":f_vac}
                    family_info_list.append(family_info_tuple)
                return jsonify(status = 200,
                data = {"name": info[0], "birth": info[2], "gender":info[1], "vaccine":vac,
                "family_info":family_info_list})
            # 가족정보가 없을때
            else:
                return jsonify(status = 200,
                data = {"name":info[0], "birth": info[2], "gender":info[1], "vaccine":vac})
        # username이 없을때
        else:
            return jsonify(status = 200, result = result) #null값

    def put(self, id):
        args = parser.parse_args()
        params = request.get_json()
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        username = params['name']
        birthday = params['birth']
        gender = params['gender']
        vaccines = params['vaccine']
        print(username)
        print(vaccines)

        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        cursor.execute(sql, (id,))
        result = cursor.fetchone()

        # 회원정보 수정(이름없을때 등록/ 후에는 못바꾸게)
        if result[0] is None:
            sql = "UPDATE `user_info` SET username = %s, birthday = %s, gender = %s WHERE `id` = %s"
            cursor.execute(sql, (username, birthday, gender, id))
            conn.commit()
            for item in vaccines:
                sql = "SELECT id from `vaccine` WHERE name = %s"
                cursor.execute(sql, (item,))
                vaccine_id = cursor.fetchone()
                sql = "INSERT INTO `get_vaccine` (user_info_id, vaccine_id) VALUES (%s, %s)"
                cursor.execute(sql, (id, vaccine_id[0]))
                conn.commit()

            return jsonify(status = "success")
        else:
            family = params['family_info']

    def post(self, id):
        args = parser.parse_args()
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        params = request.get_json()
        family = params['family_info']
        sql = "SELECT username FROM `user_info` WHERE `id` = %s"
        cursor.execute(sql, (id,))
        result = cursor.fetchone()
        # 가족 정보 insert
        if result:
            for i in range(len(family)):
                name = family[i]["name"]
                gender = family[i]["gender"]
                birth = family[i]["birth"]
                relationship = family[i]["relationship"]
                vaccine = family[i]["vaccine"]
                sql = "INSERT INTO `family_info` (name, birthday, relationship_with_user, gender, user_info_id) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql, (name, birth, relationship, gender, id))
                conn.commit()

                id_sql = "SELECT id FROM `family_info` WHERE user_info_id = %s AND name = %s"
                cursor.execute(id_sql, (id, name))
                family_id = cursor.fetchone()

                for item in vaccine:
                    sql = "SELECT id from `vaccine` WHERE name = %s"
                    cursor.execute(sql, (item,))
                    vaccine_id = cursor.fetchone()
                    sql = "INSERT INTO `get_vaccine` (family_info_id, vaccine_id, user_info_id) VALUES (%s, %s, %s)"
                    cursor.execute(sql, (family_id[0], vaccine_id[0], id))
                    conn.commit()

            return jsonify(status = "success")

    def delete(self, id):
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        vaccine_sql = "DELETE FROM `get_vaccine` WHERE `user_info_id` = %s"
        cursor.execute(vaccine_sql, (id,))
        family_sql = "DELETE FROM `family_info` WHERE `user_info_id` = %s"
        cursor.execute(family_sql, (id,))
        sql = "DELETE FROM `user_info` WHERE `id` = %s"
        cursor.execute(sql, (id,))
        conn.commit()

        return jsonify(status = "success")

api.add_resource(
    UserInfo,
    "/userinfo/<id>"
)
