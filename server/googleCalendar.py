from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import jwt_required

from config import CLIENT_SECRETS_FILE

# google calendar api module
import calendarmodule as calendar

# google calendar user authorization
creds = calendar.get_credentials()
service = calendar.build_service()

# Google Calendar API
googleCalendar = Blueprint("googleCalendar", __name__, url_prefix='/calendar')

# Google Calendar RESTful API
# bp = Blueprint("googleCalendar", __name__, url_prefix="/calendar")
# api = Api(bp)

SCOPES = ['https://www.googleapis.com/auth/calendar']

# Google Calendar API

parser_googleCalendar = reqparse.RequestParser()
parser_googleCalendar.add_argument('_id')
parser_googleCalendar.add_argument('summary')
parser_googleCalendar.add_argument('description')
parser_googleCalendar.add_argument('date')
parser_googleCalendar.add_argument('time')
parser_googleCalendar.add_argument('location')

# 전체 일정 정보 불러오기
@googleCalendar.route('/')
# @jwt_required()
def callCalendar():

    error = None

    if not creds:
        error = 'There is no authorization from google account'
    else:
        return jsonify(
            status = 200,
            result = calendar.get_all_event(service)
        )

    return jsonify(
        status = 400,
        error = error
    )

# 선택한 일정 정보 불러오기
@googleCalendar.route('/get')
# @jwt_required()
def showCalendar():
    args = parser_googleCalendar.parse_args()

    error = None

    if not creds:
        error = 'There is no authorization from google account'

    elif not args['_id']:
        error = 'Please enter the selected event id yot want to show'

    if error is None:
        eventId = args['_id']
        result = calendar.get_event(service, eventId)

        return jsonify(
            status = 200,
            result = result
        )

    else:
        return jsonify(
                status = 500,
                error = error
            )

# 일정 정보 추가하기
@googleCalendar.route('/insert', methods = ['POST'])
# @jwt_required()
def insertCalendar():
    args = parser_googleCalendar.parse_args()

    error = None

    if not creds:
        error = "There is no authorization from google account"

    elif not args['summary']:
        error = 'Please enter the content of summary from the selected event id yot want to add'

    elif not args['location']:
        error = 'Please enter the content of location from the selected event id yot want to add'

    elif not args['time']:
        error = 'Please enter the content of time from the selected event id yot want to add'

    elif not args['date']:
        error = 'Please enter the content of date from the selected event id yot want to add'

    if error is None:
        result = calendar.insert_event(service, args['summary'], args['location'], args['description'], args['date'], args['time'])
        # print('Event created: %s' % (event.get('htmlLink')))
        return jsonify(
            status = 200,
            result = result
        )

    return jsonify(
        status = 500,
        error = error
    )

# 일정 정보 수정하기
@googleCalendar.route('/update', methods = ['PUT'])
# @jwt_required()
def updateCalendar():
    args = parser_googleCalendar.parse_args()

    error = None

    if not creds:
        error = "There is no authorization from google account"

    elif not args['_id']:
        error = 'Please enter the event id'

    elif not args['summary']:
        error = 'Please enter the content of summary from the selected event id you want to update'

    elif not args['location']:
        error = 'Please enter the content of location from the selected event id yot want to update'

    elif not args['date']:
        error = 'Please enter the content of date from the selected event id you want to update'

    elif not args['time']:
        error = 'Please enter the content of time from the selected event id you want to update'

    if error is None:
        result = calendar.update_event(service, args['_id'], args['summary'], args['location'], args['description'], args['date'], args['time'])

        return jsonify(
            status = 200,
            result = result
            )

    return jsonify(
        status = 500,
        error = error
    )

# 일정 정보 삭제하기
@googleCalendar.route('/delete', methods = ['DELETE'])
# @jwt_required()
def deleteCalendar():
    args = parser_googleCalendar.parse_args()

    error = None

    if not args['_id']:
        error = 'Please enter the event id you want to delete'

    if error is None:
        service.events().delete(calendarId = 'primary', eventId = args['_id']).execute()
        return jsonify(
            status = 200,
            deleted_id = args['_id']
        )

    return jsonify(
        status = 500,
        error = error
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
