from flask import Blueprint

test = Blueprint("test", __name__, url_prefix = '/test')

@test.route("/blueprint")
def example():
    return "This is bluprint"
