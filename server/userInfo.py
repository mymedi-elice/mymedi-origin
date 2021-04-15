from flask import Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from google.oauth2 import id_token
from google.auth.transport import requests

from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from config import CLIENT_ID

# db
from module.db import connection_pool

userInfo = Blueprint("userinfo", __name__)
api = Api(userInfo)

"""
UserInfo APIs - 회원정보 CRUD

Read API : 회원정보를 열람
Create API : 가족 구성원의 관계, 이름, 생일, 성별을 입력받아 가족정보에 새로운 가족을 입력
Update API : 회원정보를 변경(정확히는 null값 채우기)
Delete API : 회원정보를 제거
"""
# parser_userinfo = reqparse.RequestParser()
# parser_userinfo.add_argument('sub')
# parser_userinfo.add_argument('name')
# parser_userinfo.add_argument('gender')
# parser_userinfo.add_argument('birth')
# parser_userinfo.add_argument('vaccine')
# parser_userinfo.add_argument('family_info')

class UserInfo(Resource):
    @jwt_required()
    def get(self):
        sub = get_jwt_identity()
        print('sub: ', sub)
        # params = request.get_json()
        # sub = params['sub']

        # db connect & cursor
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        # 로그인한 user의 table id 값 받아오기
        user_id_sql = "SELECT `id` FROM `user_info` WHERE `sub` = %s"
        cursor.execute(user_id_sql, (sub, ))
        user_id = cursor.fetchone()[0]
        print('user_id: ', user_id)

        # 로그인한 user의 user_id를 바탕으로 최초 유저정보 등록을 한 유저만 유저 정보를 볼 수 있도록 설정
        user_name_sql = "SELECT `username` FROM `user_info` WHERE `id` = %s"
        cursor.execute(user_name_sql, (user_id, ))
        user_name_i = cursor.fetchone() # user_name이 존재하는지 체크하는 용도
        user_name = user_name_i[0]
        print('user_name: ', user_name)

        # 로그인한 user가 최초 유저정보 등록으로 username이 있다면
        if user_name_i:
            user_info_sql = "SELECT `username`, `gender`, `birthday` FROM `user_info` WHERE `id` = %s"
            cursor.execute(user_info_sql, (user_id, ))
            user_info = cursor.fetchone()
            print('user_info: ', user_info)
            # 로그인한 user의 vaccine 접종 목록을 get_vaccine table에서 가져오기
            # 전체 백신 목록
            user_vaccine_sql = "SELECT `vaccine_id` FROM `get_vaccine` WHERE `get_vaccine` = 1 and `family_info_id` is NULL and `user_info_id` = %s"
            cursor.execute(user_vaccine_sql, (user_id, ))
            user_vaccine = cursor.fetchall()
            print('user_vaccine: ', user_vaccine)
            user_vaccine_list = []
            for vaccine in user_vaccine:
                user_vaccine_list.append(vaccine[0])
            print('user_vaccine_list: ', user_vaccine_list)
            # 로그인한 user의 가족정보 조회
            family_id_sql = "SELECT `id` FROM `family_info` WHERE `user_info_id` = %s"
            cursor.execute(family_id_sql, (user_id, ))
            family_id= cursor.fetchall()
            print('family_id: ', family_id)

            # 로그인한 user의 가족정보가 존재할 때
            if family_id != []:
                family_info_list = []
                for info in family_id:
                    family_info_sql = "SELECT `name`, `birthday`, `gender` FROM `family_info` WHERE `id` = %s"
                    cursor.execute(family_info_sql, (info[0], ))
                    family_info = cursor.fetchone()
                    print('family_id: ', info[0])
                    print('family_info: ', family_info)
                    # 로그인한 user의 가족 정보 중 vaccine 정보 조회
                    family_info_vaccine_sql = "SELECT `vaccine_id` FROM `get_vaccine` WHERE `get_vaccine` = 1 and `family_info_id` = %s and `user_info_id` = %s"
                    cursor.execute(family_info_vaccine_sql, (info[0], user_id ))
                    family_info_vaccine = cursor.fetchall()
                    print('family_info_vaccine: ', family_info_vaccine)
                    family_info_vaccine_list = []
                    for v in family_info_vaccine:
                        family_info_vaccine_list.append(v[0])
                    print('family_info_vaccine_list: ', family_info_vaccine_list)
                    family_info_temp = {
                        "family_id": info[0],
                        "name": family_info[0],
                        "birth": family_info[1],
                        "gender": family_info[2],
                        "vaccine": family_info_vaccine_list
                    }
                    family_info_list.append(family_info_temp)

                return jsonify(
                    status = 200,
                    result = {
                        "user_id": user_id,
                        "name": user_info[0],
                        "birth": user_info[2],
                        "gender": user_info[1],
                        "vaccine": user_vaccine_list,
                        "family_info": family_info_list
                    }
                )

            return jsonify(
                status = 200,
                result = {
                    "user_id": user_id,
                    "name": user_info[0],
                    "birth": user_info[2],
                    "gender": user_info[1],
                    "vaccine": user_vaccine_list
                }
            )

        else:
            return jsonify(
                status = 500,
                error = "There is no username from your logged in google account, Register user information first"
            )
    @jwt_required()
    def post(self):
        sub = get_jwt_identity()
        params = request.get_json()
        print('params: ', params)
        # sub = params['sub'] # postman api 검증용 (frontend에서 accesstoken 넘겨주면 삭제)

        # db connect & cursor
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        # 로그인한 user의 table id 값 받아오기
        sql = "SELECT `id` FROM `user_info` WHERE `sub` = %s"
        cursor.execute(sql, (sub, ))
        user_id = cursor.fetchone()[0]

        user_error = None

        # 처음 로그인한 user는 회원정보 등록 페이지로 넘어가서 기본적인 인적 사항을 입력한다.
        if not params['name']:
            user_error = "There is no username info"
        elif not params['birth']:
            user_error = "There is no birth info"
        elif not params['gender']:
            user_error = "There is no gender info"

        if user_error is None:

            # 로그인한 user의 name, birth, gender를 user_info table에 입력
            sql = 'UPDATE `user_info` SET `username` = %s, `birthday` = %s, `gender` = %s WHERE `id` = %s'
            cursor.execute(sql, (params['name'], params['birth'], params['gender'], user_id))
            conn.commit()

            all_vaccine_check_sql = "SELECT * FROM `get_vaccine` WHERE `user_info_id` = %s"
            cursor.execute(all_vaccine_check_sql, (user_id, ))
            all_vaccine_check = cursor.fetchall()
            print('all_vaccine_check: ', all_vaccine_check)

            if all_vaccine_check == []:
                # 로그인한 user의 모든 vaccine 접종에 대해서 get_vaccine column을 0으로 입력
                for i in range(1, 14):
                    all_vaccine_sql = "INSERT INTO `get_vaccine` (`get_vaccine`, `user_info_id`, `vaccine_id`) VALUES (%s, %s, %s)"
                    cursor.execute(all_vaccine_sql, (0, user_id, i))
                    conn.commit()

            # 로그인한 user의 vaccine 정보(vaccine_id)를 get_vaccine table에 저장
            if params['vaccine'] != []:
                for vaccine_id in params['vaccine']:
                    print('vaccine_id: ', vaccine_id)
                    user_get_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `user_info_id` = %s and `vaccine_id` = %s"
                    cursor.execute(user_get_vaccine_sql, (1, user_id, vaccine_id))
                    conn.commit()

            # 로그인한 user의 family_info가 있다면 family_info table에 추가
            family_info = params['family_info']
            print('family_info: ', family_info)

            if family_info != []:
                for family in family_info:
                    sql = "INSERT INTO `family_info` (`name`, `birthday`, `gender`, `user_info_id`) VALUES (%s, %s, %s, %s)"
                    cursor.execute(sql, (family['name'], family['birth'], family['gender'], user_id))
                    conn.commit()

                    # 로그인한 user의 특정 가족의 family_id를 받아오기
                    family_sql = "SELECT `id` FROM `family_info` WHERE `user_info_id` = %s AND `name` = %s"
                    cursor.execute(family_sql, (user_id, family['name']))
                    family_id = cursor.fetchone()[0]
                    print('family_id: ', family_id)
                    print('family_vaccine:', family['vaccine'])

                    all_family_vaccine_check = "SELECT * FROM `get_vaccine` WHERE `user_info_id` = %s and `family_info_id` = %s"
                    cursor.execute(all_family_vaccine_check, (user_id, family_id))
                    all_family_vaccine = cursor.fetchall()
                    print('all_family_vaccine: ', all_family_vaccine)

                    if all_family_vaccine == []:
                        # 로그인한 user의 특정 가족의 family_id를 통해 모든 vaccine 접종에 대해서 get_vaccine column을 0으로 설정
                        for i in range(1, 14):
                            all_family_vaccine_sql = "INSERT INTO `get_vaccine` (`get_vaccine`, `family_info_id`, `user_info_id`, vaccine_id) VALUES (%s, %s, %s, %s)"
                            cursor.execute(all_family_vaccine_sql, (0, family_id, user_id, i))

                    # 로그인한 user의 family_id에 해당하는 vaccine 정보(vaccine_id)를 get_vaccine table에 저장
                    for vaccine_id in family['vaccine']:
                        print('vaccine_id: ', vaccine_id)
                        family_get_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
                        cursor.execute(family_get_vaccine_sql, (1, family_id, user_id, vaccine_id))
                        conn.commit()

            return jsonify(
                status = 200,
                result = {
                    'name': params['name'],
                    'birth': params['birth'],
                    'gender': params['gender'],
                    'vaccine': params['vaccine'],
                    'family_info': family_info
                }
            )

        return jsonify(
            status = 500,
            result = {
                "error": user_error
            }
        )
    @jwt_required()
    def put(self):
        sub = get_jwt_identity()
        # args = parser_userinfo.parse_args()
        params = request.get_json()
        print('params: ', params)
        # sub = params['sub'] # postman api 검증용 (frontend에서 accesstoken 넘겨주면 삭제)
        # print('sub: ', sub)

        # db connect & cursor
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        # 로그인한 user의 table id 값 받아오기
        sql = "SELECT `id` FROM `user_info` WHERE `sub` = %s"
        cursor.execute(sql, (sub, ))
        user_id = cursor.fetchone()[0]
        print('user_id: ', user_id)

        user_error = None

        if not params['name']:
            user_error = "There is no username info"
        elif not params['birth']:
            user_error = "There is no birth info"
        elif not params['gender']:
            user_error = "There is no gender info"

        if user_error is None:
            # 로그인한 user의 name, birth, gender에 대해서 user_info table에 수정
            user_info_sql = 'UPDATE `user_info` SET `username` = %s, `birthday` = %s, `gender` = %s WHERE `id` = %s'
            cursor.execute(user_info_sql, (params['name'], params['birth'], params['gender'], user_id))
            conn.commit()
        else:
            return jsonify(
                stataus = 500,
                error = user_error
            )

        # 로그인한 user의 vaccine 정보 (vaccine_id)를 get_vaccine table에서 0으로 초기화
        for i in range(1, 14):
            all_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `user_info_id` = %s and `vaccine_id` = %s"
            cursor.execute(all_vaccine_sql, (0, user_id, i))
            conn.commit()

        # 로그인한 user의 vaccine 정보(vaccine_id)를 get_vaccine table에서 수정
        if params['vaccine'] != []:
            for vaccine_id in params['vaccine']:
                print('vaccine_id: ', vaccine_id)
                user_update_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `user_info_id` = %s and `vaccine_id` = %s"
                cursor.execute(user_update_vaccine_sql, (1, user_id, vaccine_id))
                conn.commit()

        # 로그인한 user의 기존 family_info가 있다면 family_info table에서 family_id를 통해 수정
        family_info = params['family_info']
        print('family_info: ', family_info)
        if family_info != []:
            for family in family_info:
                # 로그인한 user의 기존 family_info가 존재한다면 family_id로 구분
                family_id = family['family_id']
                print('family_id: ', family_id)
                # 로그인한 user의 기존 family_info_id가 존재한다면 family_info 수정
                if family_id != 0:
                    family_info_update_sql = "UPDATE `family_info` SET `name` = %s, `birthday` = %s, `gender` = %s WHERE `user_info_id` = %s and `id` = %s"
                    cursor.execute(family_info_update_sql, (family['name'], family['birth'], family['gender'], user_id, family_id))
                    conn.commit()

                    # 로그인한 user의 특정 가족의 family_id를 통해 모든 vaccine 접종에 대해서 get_vaccine column을 0으로 설정
                    for i in range(1, 14):
                        all_family_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
                        cursor.execute(all_family_vaccine_sql, (0, family_id, user_id, i))
                        conn.commit()

                    # 로그인한 user의 family_id에 해당하는 vaccine 정보(vaccine_id)를 get_vaccine table에 저장
                    for vaccine_id in family['vaccine']:
                        print('vaccine_id: ', vaccine_id)
                        family_update_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
                        cursor.execute(family_update_vaccine_sql, (1, family_id, user_id, vaccine_id))
                        conn.commit()

                # 로그인한 user의 기존 family_info_id가 존재하지 않다면 family_info 추가
                elif family_id == 0:
                    family_info_insert_sql = "INSERT INTO `family_info` (`name`, `birthday`, `gender`, `user_info_id`) VALUES (%s, %s, %s, %s)"
                    cursor.execute(family_info_insert_sql, (family['name'], family['birth'], family['gender'], user_id))
                    conn.commit()

                    new_family_id_sql = "SELECT `id` FROM `family_info` WHERE `name` = %s and `user_info_id` = %s"
                    cursor.execute(new_family_id_sql, (family['name'], user_id))
                    family_id = cursor.fetchone()[0]
                    print('family_id: ', family_id)

                    # 로그인한 user의 특정 가족의 family_id를 통해 모든 vaccine 접종에 대해서 get_vaccine column을 0으로 설정
                    for i in range(1, 14):
                        all_family_vaccine_sql = "INSERT INTO `get_vaccine` (`get_vaccine`, `family_info_id`, `user_info_id`, vaccine_id) VALUES (%s, %s, %s, %s)"
                        cursor.execute(all_family_vaccine_sql, (0, family_id, user_id, i))
                        conn.commit()

                    # 로그인한 user의 family_id에 해당하는 vaccine 정보(vaccine_id)를 get_vaccine table에 저장
                    for vaccine_id in family['vaccine']:
                        print('vaccine_id: ', vaccine_id)
                        family_update_vaccine_sql = "UPDATE `get_vaccine` SET `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
                        cursor.execute(family_update_vaccine_sql, (1, family_id, user_id, vaccine_id))
                        conn.commit()

        return jsonify(
            status = 200,
            result = {
                'name': params['name'],
                'birth': params['birth'],
                'gender': params['gender'],
                'vaccine': params['vaccine'],
                'family_info': family_info
            }
        )
    @jwt_required()
    def delete(self):
        sub = get_jwt_identity()
        params = request.get_json()
        family_id = params['family_id']

        error = None

        if not family_id:
            error = "There is no family_id"

        if error is not None:
            return jsonify(
                status = 500,
                error = error
            )

        # db
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        # 로그인한 user의 table id 값 받아오기
        sql = "SELECT `id` FROM `user_info` WHERE `sub` = %s"
        cursor.execute(sql, (sub, ))
        user_id = cursor.fetchone()[0]
        print('user_id: ', user_id)

        # 가족 백신 정보 삭제
        delete_vaccine_sql = "DELETE FROM `get_vaccine` WHERE `user_info_id` = %s and `family_info_id` = %s"
        cursor.execute(delete_vaccine_sql, (user_id, family_id))

        # 가족 정보 삭제
        delete_family_info_sql = "DELETE FROM `family_info` WHERE `user_info_id` = %s and `id` = %s"
        cursor.execute(delete_family_info_sql, (user_id, family_id))

        conn.commit()

        return jsonify(
            status = "success",
            deleted_family_id = family_id

            )


api.add_resource(
    UserInfo,
    "/userinfo"
)
