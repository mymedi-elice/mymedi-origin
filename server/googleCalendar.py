from __future__ import print_function
import datetime
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import jwt_required

from config import CLIENT_SECRETS_FILE

# Google Calendar API
googleCalendar = Blueprint("googleCalendar", __name__, url_prefix='/calendar')

# Google Calendar RESTful API
# bp = Blueprint("googleCalendar", __name__, url_prefix="/calendar")
# api = Api(bp)

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
            event_id = event['id']
            datetime = event['start'].get('dateTime', event['start'].get('date'))
            # print('datetime: ', datetime)
            date = datetime.split('T')[0]
            # print('date: ', date)
            time = datetime.split('T')[1].split('+')[0]
            # print('time: ', time)
            location = event['location']
            summary = event['summary']
            temp['id'] = event_id; temp['date'] = date; temp['time'] = time; temp['location'] = location; temp['summary'] = summary;
            result.append(temp)
        return result

def get_event(credentials, service, get_id):
    temp = {}
    eventId = get_id
    event = service.events().get(calendarId = 'primary', eventId = eventId).execute()
    summary = event['summary']
    datetime = event['start'].get('dateTime', event['start'].get('date'))
    print('datetime: ', datetime)
    date = datetime.split('T')[0]
    print('date: ', date)
    time = datetime.split('T')[1].split('+')[0]
    print('time: ', time)
    location = event['location']
    temp['id'] = eventId; temp['date'] = date; temp['time'] = time; temp['location'] = location; temp['summary'] = summary;
    return temp

def insert_event(credentials, service, summary, location, description, date, time):
    event = {
        'summary': summary, # 일정 제목
        'location': location, # 일정 장소
        'description': description, # 일정 설명
        'start': { # 시작 날짜
            'dateTime': date+'T'+time,
            'timeZone': 'Asia/Seoul',
        },
        'end': { # 종료 날짜
            'dateTime': date+'T'+time,
            'timeZone': 'Asia/Seoul',
        },
        'reminders': { # 알림 설정
            'useDefault': False
        },
    }
    temp = {}
    temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
    inserted_event = service.events().insert(calendarId = 'primary', body = event).execute()
    return temp

def update_event(credentials, service, update_id, summary, location, description, date, time):
    get_event = service.events().get(calendarId = 'primary', eventId = update_id).execute()
    update_event = {
        'summary': summary, # 일정 제목
        'location': location, # 일정 장소
        'description': description, # 일정 설명
        'start': { # 시작 날짜
            'dateTime': date+'T'+time,
            'timeZone': 'Asia/Seoul',
        },
        'end': { # 종료 날짜
            'dateTime': date+'T'+time,
            'timeZone': 'Asia/Seoul',
        },
        'reminders': { # 알림 설정
            'useDefault': False
        },
    }
    temp = {}
    temp['id'] = update_id; temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
    updated_event = service.events().update(calendarId = 'primary', eventId = update_id, body = update_event).execute()
    return temp



# Google Calendar API

parser_googleCalendar = reqparse.RequestParser()
parser_googleCalendar.add_argument('_id')
parser_googleCalendar.add_argument('summary')
parser_googleCalendar.add_argument('description')
parser_googleCalendar.add_argument('date')
parser_googleCalendar.add_argument('time')
parser_googleCalendar.add_argument('location')


@googleCalendar.route('/')
# @jwt_required()
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

@googleCalendar.route('/get')
# @jwt_required()
def showCalendar():
    args = parser_googleCalendar.parse_args()
    creds = get_credentials()
    service = build_service()

    eventId = args['_id']
    result = get_event(creds, service, eventId)

    return jsonify(
        status = 200,
        result = result
    )

@googleCalendar.route('/insert', methods = ['POST'])
# @jwt_required()
def insertCalendar():
    args = parser_googleCalendar.parse_args()
    creds = get_credentials()
    service = build_service()

    result = insert_event(creds, service, args['summary'], args['location'], args['description'], args['date'], args['time'])
    # print('Event created: %s' % (event.get('htmlLink')))
    return jsonify(
        status = 200,
        result = result
    )

@googleCalendar.route('/update', methods = ['PUT'])
# @jwt_required()
def updateCalendar():
    args = parser_googleCalendar.parse_args()
    creds = get_credentials()
    service = build_service()

    result = update_event(creds, service, args['_id'], args['summary'], args['location'], args['description'], args['date'], args['time'])

    return jsonify(
        status = 200,
        result = result
        )

@googleCalendar.route('/delete', methods = ['DELETE'])
# @jwt_required()
def deleteCalendar():
    args = parser_googleCalendar.parse_args()
    creds = get_credentials()
    service = build_service()
    service.events().delete(calendarId = 'primary', eventId = args['_id']).execute()
    return jsonify(
        status = 200,
        deleted_id = args['_id']
    )


# Google Calendar RESTful API

# parser_googleCalendar = reqparse.RequestParser()
# parser_googleCalendar.add_argument('summary')
# parser_googleCalendar.add_argument('start_date')
# parser_googleCalendar.add_argument('end')
# parser_googleCalendar.add_argument('location')

# class googleCalendar(Resource):

#     # @jwt_required()
#     def get(self):
#         creds = get_credentials()
#         service = build_service()

#         error = None
#         if not creds:
#             error = 'There is no authorization from google account'
#         else:
#             return jsonify(
#                 status = 200,
#                 result = get_upcoming_10_events(creds, service)
#             )

#         return jsonify(
#             status = 400,
#             error = result
#         )

#     # @jwt_required()
#     def post(self):
#         # args = parser_googleCalendar.parse_args()
#         # summary = args['summary']
#         # startDate = args['startDate'] # YYYY-MM-DD
#         # endDate = args['endDate'] # YYYY-MM-DD
#         # location = args['location'] # 도로명 주소

#         event = {
#         'summary': '독감 백신 예방접종', # 일정 제목
#         'location': '관악구보건소, 대한민국 서울특별시 관악구 청룡동 관악로 145', # 일정 장소
#         'description': '', # 일정 설명
#         'start': { # 시작 날짜
#             'dateTime': '2021-04-14T09:00:00',
#             'timeZone': 'Asia/Seoul',
#         },
#         'end': { # 종료 날짜
#             'dateTime': '2021-04-14T10:00:00',
#             'timeZone': 'Asia/Seoul',
#         },
#     }

#         event = service.events().insert(calendarId = 'primary', body = event).execute()
#         print('Event created: %s' % (event.get('htmlLink')))
#         return jsonify(
#             status = 200
#         )

# api.add_resource(googleCalendar, '/')
