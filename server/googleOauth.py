import os
import pathlib
import requests

from flask import Blueprint, jsonify, request, Flask, session, abort, redirect

# Google Oauth
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from pip._vendor import cachecontrol
import google.auth.transport.requests

# flask_jwt_extended를 사용하여 서버와 클라이언트 사이에서 토큰으로 인증
# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import current_user
# from flask_jwt_extended import jwt_required
# from flask_jwt_extended import get_jwt_identity

googleOauth = Blueprint("googleOauth", __name__, url_prefix = "/googleOauth")

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# google client id, client secrets file
GOOGLE_CLIENT_ID = "407922643860-88f2ocd6cu73t655ua5qm37enbg7mhjj.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file = client_secrets_file,
    scopes = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.readonly", "openid"],
    redirect_uri = "http://127.0.0.1:5000/googleOauth/callback"
    )

def login_is_required(function):
    def wrapper(*args, **kwargs):
        if 'google_id' not in session:
            return abort(401) # Authorization required
        else:
            return function()
    return wrapper

@googleOauth.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@googleOauth.route("/callback")
def callback():
    flow.fetch_token(authorization_response = request.url)

    if not session['state'] == request.args['state']:
        abort(500) # State does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session = cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token = credentials._id_token,
        request = token_request,
        audience = GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")

    return redirect('/googleOauth/protected_area')

@googleOauth.route('/logout')
def logout():
    session.clear()
    return jsonify(
        status = "success",
        message = "Logout Success!"
    )

@googleOauth.route("/")
def index():
    return "Hello World <a href = '/googleOauth/login'><button>Login</button></a>"

@googleOauth.route("/protected_area")
@login_is_required
def protected_area():
    return "Protected! <a href = '/googleOauth/logout'><button>Logout</button></a>"
