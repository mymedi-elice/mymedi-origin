from __future__ import print_function
import datetime
import os.path

from flask import Blueprint, jsonify, request, Flask

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from config import CLIENT_SECRET, CLIENT_ID, CLIENT_SECRETS_FILE, REDIRECT_URI

googleCalendar = Blueprint("googleCalendar", __name__, url_prefix = "/calendar")

client_secrets_file = CLIENT_SECRETS_FILE

# 사용 권한 지정
# https://www.googleapis.com/auth/calendar	               캘린더 읽기/쓰기 권한
# https://www.googleapis.com/auth/calendar.readonly	       캘린더 읽기 권한
scopes = ['https://www.googleapis.com/auth/calendar']

# 파일에 담긴 인증 정보로 구글 서버에 인증하기
# 새 창이 열리면서 구글 로그인 및 정보 제공 동의 후 최종 인증이 완료

@googleCalendar.route('/')
def googleCalendarStart():
    creds = None

    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', scopes)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                client_secrets_file, scopes
            )
            creds = flow.run_local_server(port = 0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('calendar', 'v3', credentials = creds)

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    print('Getting the upcoming 10 events')
    events_result = service.events().list(calendarId = 'primary', timeMin = now, maxResults = 10, singleEvents = True, orderBy = 'startTime').execute()
    events = events_result.get('items', [])

    msg = None

    if not events:
        msg = 'No upcoming events found.'

    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        result = {start: start, summary: event['summary']}

    return jsonify(
        status = 200,
        result = result,
        msg = msg
    )
