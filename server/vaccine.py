from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests
from config import CLIENT_ID

# db
from module.db import connection_pool

vaccine = Blueprint("vaccine", __name__)
api = Api(vaccine)

"""
Vaccine APIs - 백신 정보 R
Read API : 백신(질환명)을 열람
"""

class Vaccine(Resource):
    def get(self):
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        get_vaccine = []
        korean_sql = "SELECT id, korean FROM `vaccine`"
        cursor.execute(korean_sql,)
        korean = cursor.fetchall()
        korean_data = []
        #유저,가족의 해당 id 가져와서 get_vaccine에서 1인 vaccine_id로 리스트 생성(get_vaccine)
        for ko in korean:
            if ko[0] not in get_vaccine:
                data = {"id":ko[0], "name":ko[1]}
                korean_data.append(data)

        vietnam_sql = "SELECT id, vietnam FROM `vaccine`"
        cursor.execute(vietnam_sql,)
        vietnam = cursor.fetchall()
        vietnam_data = []
        for vi in vietnam:
            data = {"id":vi[0], "name":vi[1]}
            vietnam_data.append(data)

        english_sql = "SELECT id, english FROM `vaccine`"
        cursor.execute(english_sql,)
        english = cursor.fetchall()
        english_data = []
        for en in english:
            data = {"id":en[0], "name":en[1]}
            english_data.append(data)

        return jsonify(status = 200, data = {"korean":korean_data, "vietnam":vietnam_data, "english":english_data})


api.add_resource(
    Vaccine,
    "/vaccine/"
)
