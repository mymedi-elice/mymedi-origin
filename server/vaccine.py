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

        korean_sql = "SELECT id, korean FROM `vaccine`"
        cursor.execute(korean_sql,)
        korean = cursor.fetchall()
        korean_data = []
        for ko in korean:
            data = {"id":ko[0], "name":ko[1]}
            korean_data.append(data)

        vietnamese_sql = "SELECT id, vietnamese FROM `vaccine`"
        cursor.execute(vietnamese_sql,)
        vietnamese = cursor.fetchall()
        vietnamese_data = []
        for vi in vietnamese:
            data = {"id":vi[0], "name":vi[1]}
            vietnamese_data.append(data)

        english_sql = "SELECT id, english FROM `vaccine`"
        cursor.execute(english_sql,)
        english = cursor.fetchall()
        english_data = []
        for en in english:
            data = {"id":en[0], "name":en[1]}
            english_data.append(data)

        return jsonify(status = 200, data = {"korean":korean_data, "vietnamese":vietnamese_data, "english":english_data})


api.add_resource(
    Vaccine,
    "/vaccine/"
)
