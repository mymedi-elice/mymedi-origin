# from __future__ import print_function
# import os.path
# from googleapiclient.discovery import build
# from google_auth_oauthlib.flow import InstalledAppFlow
# from google.auth.transport.requests import Request
# from google.oauth2.credentials import Credentials

# import requests
# import logging
# from datetime import datetime, timedelta

# from flask import Blueprint, jsonify, request

# googleCalendar = Blueprint("googleCalendar", __name__, url_prefix="/calendar")
# access_token = "ya29.a0AfH6SMD9LDmctt9NzYl8njU2GtdCU7IoWcVAtIHN9Qqjrl3MqKKliokDJNva_VZoesmC4B5mtLNO2FdBOH98h8UZyrEElll6mBpadCzrWZEhHMRbw8JNI89FMFbgAv6rJxBnvBeNQ5zCNxwGVtYrz09LDl9PQQ"
# # Google Calendar API를 사용하기 위한 모듈

# def get_calendar_id(access_token):
#     headers = {'Authorization': f'Bearer {access_token}'}
#     response = requests.get(
#         'https://www.googleapis.com/calendar/v3/user/me/calendarList',
#         headers = headers
#     )
#     logging.info('calendar response %s %s', response.status_code, response.text)
#     print(response)
#     return response



# @googleCalendar.route('/')
# def callCalendar():
#     get_calendar_id(access_token)
#     return jsonify(
#         status = 200
#     )

from __future__ import print_function
import datetime
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from flask import Blueprint, jsonify, request
from config import CLIENT_SECRETS_FILE

googleCalendar = Blueprint("googleCalendar", __name__, url_prefix="/calendar")

SCOPES = ['https://www.googleapis.com/auth/calendar']

# Google Calendar API를 사용하기 위한 모듈

def get_credentials():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES
            )
            print("success")
            creds = flow.run_local_server(host = 'localhost', port = 8080)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def build_service():
    credentials = get_credentials()
    service = build('calendar', 'v3', credentials = credentials)
    return service

def get_now_date():
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    return now

def get_upcoming_10_events(credentials, service):
    creds = credentials
    service = service

    print('Getting the upcoming 10 events')

    events_result = service.events().list(calendarId='primary', timeMin=get_now_date(),
                                        maxResults=10, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])

    msg = None
    result = [] # Upcoming 10 events from now

    if not events:
        msg = "No upcoming events found from now"
        return msg
    else:
        for event in events:
            temp = {}
            start = event['start'].get('dateTime', event['start'].get('date'))
            end = event['end'].get('dateTime', event['end'].get('date'))
            location = event['location']
            summary = event['summary']
            temp['start'] = start; temp['end'] = end; temp['location'] = location; temp['summary'] = summary
            result.append(temp)
        return result

# Google Calendar API

@googleCalendar.route('/')
def callCalendar():
    creds = get_credentials()
    service = build_service()

    error = None

    if not creds:
        error = 'There is no authorization from google account'
    else:
        return jsonify(
            status = 200,
            result = get_upcoming_10_events(creds, service)
        )

    return jsonify(
        status = 400,
        error = error
    )
