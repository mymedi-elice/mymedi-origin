from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource

from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from config import CLIENT_SECRETS_FILE

# db
from module.db import connection_pool

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
parser_googleCalendar.add_argument('color')
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
@jwt_required()
def showCalendar():
    sub = get_jwt_identity()
    print("sub: ", sub)
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
@jwt_required()
def insertCalendar():
    sub = get_jwt_identity()
    print("sub: ", sub)
    params = request.get_json()
    print(params['color'])
    print(params['family_id'])
    print(params)

    error = None

    if not creds:
        error = "There is no authorization from google account"

    elif not params['color']:
        error = 'Please enter the content of colorId from the selected event id you want to add'

    elif not params['summary']:
        error = 'Please enter the content of summary from the selected event id yot want to add'

    elif not params['location']:
        error = 'Please enter the content of location from the selected event id you want to add'

    elif not params['time']:
        error = 'Please enter the content of time from the selected event id you want to add'

    elif not params['date']:
        error = 'Please enter the content of date from the selected event id you want to add'

    elif not params['family_id']:
        error = 'Please enter the content of family id from the selected event id you want to add'

    elif not params['vaccine_id']:
        error = "Please enter the content of vaccine id from the selected event id you want to add"

    user_id = calendar.sub_to_user_id(sub) # sub 정보로 user_info table에서 user_id 검색

    if error is None:
        family_id = int(params['family_id'])
        vaccine_id = int(params['vaccine_id'])
        # 입력된 family_id의 일정에 사용자의 가족 구성원 정보 등록 (단순 일정 or 예방 접종)
        if family_id != 0:
            # 입력된 family_id의 정보가 family_info에 존재하면
            if calendar.check_family_info(family_id):
                # 예방 접종을 하기 위해서 병원에 방문하게 된다면 vaccine_id 값이 존재
                if vaccine_id != 0:
                    # family_id에 해당하는 백신 정보가 이미 등록되지 않았다면 - user_id (o), family_id (o)
                    if calendar.get_vaccine_info_check(user_id, family_id) == []:
                        # family_id에 대한 default vaccine_table을 get_vaccine table에 생성 - user_id(o), family_id (o)
                        calendar.get_vaccine_table_default(user_id, family_id)
                        # family_id에 대한 입력된 vaccine_id를 get_vaccine table에 등록 - user_id(o), family_id (o), vaccine_id(o)
                        calendar.save_vaccine_info(params['date'], user_id, family_id, vaccine_id)
                        result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])
                    # family_id에 해당하는 백신 정보가 이미 등록되어 있다면 예방 접종할 질병에 대한 vaccine_id를 추가 - user_id(o), family_id (o), vaccine_id(o)
                    else:
                        calendar.save_vaccine_info(params['date'], user_id, family_id, vaccine_id)
                        result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])
                # 예방 접종을 하지 않고 단순 일정 등록 (vaccine_id 값이 없을 때) - user_id (o), family_id (o), vaccine_id (x)
                elif vaccine_id == 0:
                    result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])
            # 입력된 family_id의 정보가 family_info에 존재하지 않으면
            else:
                return jsonify(
                    status = 500,
                    error = "There is no family_id in family_info"
                    )
        # family_id가 없으면 user의 일정을 등록 (단순 일정 or 예방 접종)
        elif family_id == 0:
            # 예방 접종을 하기 위해서 병원에 방문하게 된다면 vaccine_id 값이 존재
            if vaccine_id != 0:
                # user_id에 해당하는 백신 정보가 이미 등록되지 않았다면 - user_id (o), family_id (x)
                if calendar.get_vaccine_info_check(user_id, family_id) == []:
                    # user_id에 대한 default vaccine_table을 get_vaccine table에 생성 - user_id (o), family_id (x), vaccine_id (o)
                    calendar.get_vaccine_table_default(user_id, family_id)
                    # user_id에 대한 입력된 vaccine_id를 get_vaccine table에 등록 - user_id(o), family_id (x), vaccine_id (o)
                    calendar.save_vaccine_info(params['date'], user_id, family_id, vaccine_id)
                    result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])
                # user_id에 해당하는 백신 정보가 이미 등록되어 있다면 예방 접종할 질병에 대한 vaccine_id를 추가 - user_id (o), family_id (x), vaccine_id (o)
                else:
                    calendar.save_vaccine_info(params['date'], user_id, family_id, vaccine_id)
                    result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])
            # 예방 접종을 하지 않고 단순 일정 등록 (vaccine_id 값이 없을 때)
            elif vaccine_id == 0:
                result = calendar.insert_event(service, params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])

        return jsonify(
            status = 200,
            result = result,
            user_id = user_id,
            family_id = family_id,
            vaccine_id = str(vaccine_id)

        )

    return jsonify(
        status = 500,
        error = error
    )

# 일정 정보 수정하기
@googleCalendar.route('/update', methods = ['PUT'])
@jwt_required()
def updateCalendar():
    sub = get_jwt_identity()
    print("sub: ", sub)
    params = request.get_json()
    print('params: ', params)

    error = None

    if not creds:
        error = "There is no authorization from google account"

    elif not params['_id']:
        error = 'Please enter the event id'

    elif not params['color']:
        error = 'Please enter the content of colorId from the selected event id you want to update'

    elif not params['summary']:
        error = 'Please enter the content of summary from the selected event id you want to update'

    elif not params['location']:
        error = 'Please enter the content of location from the selected event id yot want to update'

    elif not params['date']:
        error = 'Please enter the content of date from the selected event id you want to update'

    elif not params['time']:
        error = 'Please enter the content of time from the selected event id you want to update'

    elif not params['family_id']:
        error = 'Please enter the content of family id from the selected event id you want to update'

    elif not params['vaccine_id']:
        error = "Please enter the content of vaccine id from the selected event id you want to update"

    elif not params['previous date']:
        error = "Please enter the content of previous date from the selected event id you want to update"

    elif not params['previous vaccine_id']:
        error = "Please enter the content of previous vaccine id from the selected event id you want to update"

    user_id = calendar.sub_to_user_id(sub) # sub 정보로 user_info table에서 user_id 검색

    if error is None:
    #     family_id = int(params['family_id'])
    #     vaccine_id = int(params['vaccine_id'])
    #     # 입력된 family_id의 일정에 사용자의 가족 구성원 정보 수정 (단순 일정 or 예방 접종)
    #     if family_id != 0:
    #         # 입력된 family_id의 정보가 family_info에 존재하면
    #         if calendar.check_family_info(family_id):
    #             # 예방 접종 내역을 수정하려면 vaccine_id가 존재
    #             if vaccine_id != 0:

        result = calendar.update_event(service, params['_id'], params['color'], params['summary'], params['location'], params['description'], params['date'], params['time'])

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
@jwt_required()
def deleteCalendar():
    sub = get_jwt_identity()
    params = request.get_json()

    user_id = calendar.sub_to_user_id(sub) # sub 정보로 user_info table에서 user_id 검색
    family_id = int(params['family_id'])

    error = None

    if not params['_id']:
        error = 'Please enter the event id you want to delete'

    elif not params['family_id']:
        error = 'Please enter the family id you want to delete'

    elif not params['date']:
        error = 'Please enter the date you want to delete'

    if error is None:
        calendar.delete_vaccine_info(user_id, family_id, params['date'])
        service.events().delete(calendarId = 'primary', eventId = params['_id']).execute()
        return jsonify(
            status = 200,
            deleted_id = params['_id'],
            deleted_user_id = user_id,
            deleted_family_id = family_id
        )

    return jsonify(
        status = 500,
        error = error
    )
