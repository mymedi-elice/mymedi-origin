from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource

auth = Blueprint("auth", __name__, url_prefix = '/auth')

parser_accessToken = reqparse.RequestParser()
parser_accessToken.add_argument('accessToken')

@auth.route("/accesstoken", methods = ['GET','POST'])
def accesstoken():
    args = parser_accessToken.parse_args()
    accessToken = args['accessToken']
    print(accessToken)
    return jsonify(status = "success", accessToken = accessToken)
