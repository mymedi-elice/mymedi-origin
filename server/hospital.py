from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests
from config import CLIENT_ID

# db
from module.db import connection_pool

hospital = Blueprint("hospital", __name__)
api = Api(hospital)

"""
Hospital APIs - 백신 정보 R
Read API : 백신(질환명)을 열람
"""

class Hospital(Resource):
    def get(self):
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        #전체데이터 로딩 너무 길어 일단 일부 데이터 가져오기
        sql = "SELECT name, address FROM `hospital` WHERE address LIKE '경기도%' limit 100"
        cursor.execute(sql,)
        datas = cursor.fetchall()
        hospitals = []
        for item in datas:
            row = {"name":item[0].decode(), "address":item[1].decode()}
            hospitals.append(row)
        return jsonify(status = 200, data = {"hospital":hospitals})


api.add_resource(
    Hospital,
    "/hospital/"
)
