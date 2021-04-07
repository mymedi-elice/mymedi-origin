from flask import Blueprint, jsonify
from module import db

test = Blueprint("test", __name__, url_prefix = '/test')

@test.route("/blueprint")
def example():
    return "This is bluprint"

# SELECT 함수 예제
@test.route('/select', methods = ['GET'])
def select():
    db_class = db.Database()
    sql = "SELECT `id`, `name` FROM `test`"
    row = db_class.executeAll(sql)
    print(row)
    return jsonify(status = "success", result = row)
