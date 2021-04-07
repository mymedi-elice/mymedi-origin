from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

from config import CLIENT_ID

# db
from module import db

user_info = Blueprint("user_info", __name__, url_prefix = '/user_info')

parser = reqparse.RequestParser()
parser.add_argument('sub')
parser.add_argument('username')
parser.add_argument('gender')
parser.add_argument('birthday')

class User_info(Resource):
    def get(self):
        db_class = db.Database()
        sql = "SELECT username FROM `user` WHERE `sub` = %s"
        result = db_class.executeOne(sql, (args['sub'],))
        if result:
            sql = "SELECT username, gender, birthday FROM `user` WHERE `sub` = %s"
            row = db_class.executeAll(sql, (args['sub']))

            return jsonify(status = "success", result = row)

        else:
            return jsonify(status = "success", result = result)
