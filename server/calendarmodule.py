# google calendar
from __future__ import print_function
import datetime
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from config import CLIENT_SECRETS_FILE

# db
from module.db import connection_pool
conn = connection_pool.get_connection()
cursor = conn.cursor()


SCOPES = ['https://www.googleapis.com/auth/calendar']

color = {
        '1': '#7986cb',
        '2': '#33b679',
        '3': '#8e24aa',
        '4': '#e67c73',
        '5': '#f6c026',
        '6': '#f5511d',
        '7': '#039be5',
        '8': '#616161',
        '9': '#3f51b5',
        '10': '#0b8043',
        '11': '#d60000',
        }

def get_credentials():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        print('creds: ', creds)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES
            )
            print("success")
            creds = flow.run_local_server()
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def build_service():
    credentials = get_credentials()
    service = build('calendar', 'v3', credentials = credentials)
    return service

def get_now_date():
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    return nows

def dict_key_upper(data):
    if isinstance(data, dict):
        return {k.upper(): v for k,v in data.items()}

def color_hexcode(color, colorId):
    selected_hexcode = color[colorId]
    return selected_hexcode

def hexcode_color(color, hexcode):
    color = {v:k for k,v in color.items()}
    changed_color = dict_key_upper(color)
    print(changed_color)
    selected_color = changed_color[hexcode]
    return selected_color

def get_upcoming_10_events(credentials, service):
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

def get_all_event(service):
    page_token = None
    msg = None
    result = []
    while True:
        events_result = service.events().list(
            calendarId = 'primary',
            pageToken = page_token
        ).execute()
        events = events_result.get('items', [])
        print('events: ', events)
        if not events:
            msg = "There are no events"
            return msg
        else:
            for event in events:
                temp = {}
                event_id = event['id']; temp['id'] = event_id
                datetime = event['start'].get('dateTime', event['start'].get('date'))
                try:
                    colorId = event['colorId']
                except:
                    colorId = "7"
                colorId = color_hexcode(color, colorId)
                try:
                    summary = event['summary']
                except:
                    summary = None
                try:
                    description = event['description']
                except:
                    description = None
                try:
                    location = event['location']
                except:
                    location = None
                try:
                    date = datetime.split('T')[0]
                except:
                    date = None
                try:
                    time = datetime.split('T')[1].split('+')[0]
                except:
                    time = None
                temp['id'] = event_id; temp['color'] = colorId; temp['summary'] = summary; temp['description'] = description; temp['location'] = location; temp['date'] = date; temp['time'] = time

                # 선택한 일정에 해당하는 예방 접종 예약에 대한 정보 불러오기
                get_vaccine_info_all_sql = "SELECT * FROM `get_vaccine` WHERE `get_date` = %s"
                cursor.execute(get_vaccine_info_all_sql, (date + " 00:00:00", ))
                get_vaccine_info_all = cursor.fetchall()
                if get_vaccine_info_all != []:
                    temp['get_vaccine'] = get_vaccine_info_all[0][1]
                    temp['family_id'] = str(get_vaccine_info_all[0][3])
                    temp['user_id'] = get_vaccine_info_all[0][4]
                    temp['vaccine_id'] = str(get_vaccine_info_all[0][5])
                    print('get_vaccine_info_all: ', get_vaccine_info_all[0])
                result.append(temp)
            return result

def get_event(service, get_id):
    temp = {}
    eventId = get_id
    event = service.events().get(calendarId = 'primary', eventId = eventId).execute()
    summary = event['summary']
    description = event['description']
    datetime = event['start'].get('dateTime', event['start'].get('date'))
    print('datetime: ', datetime)
    date = datetime.split('T')[0]
    print('date: ', date)
    time = datetime.split('T')[1].split('+')[0]
    print('time: ', time)
    location = event['location']
    temp['id'] = eventId; temp['date'] = date; temp['time'] = time; temp['location'] = location; temp['summary'] = summary; temp['description'] = description
    return temp

def get_event_date(service, event_id):
    eventId = event_id
    event = service.events().get(calendarId = 'primary', eventId = eventId).execute()
    datetime = event['start'].get('dateTime', event['start'].get('date'))
    print('datetime: ', datetime)
    date = datetime.split('T')[0]
    print('date: ', date)
    return date

def insert_event(service, hexcode, summary, location, description, date, time):
    event = {
        'colorId': hexcode_color(color, hexcode), # 일정 색깔
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
    inserted_event = service.events().insert(calendarId = 'primary', body = event).execute()
    temp['id'] = inserted_event['id']; temp['color'] = hexcode; temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
    return temp

def update_event(service, update_id, hexcode, summary, location, description, date, time):
    get_event = service.events().get(calendarId = 'primary', eventId = update_id).execute()
    update_event = {
        'colorId': hexcode_color(color, hexcode), # 일정 색깔
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
    temp['id'] = update_id; temp['color'] = hexcode; temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
    updated_event = service.events().update(calendarId = 'primary', eventId = update_id, body = update_event).execute()
    return temp

def sub_to_user_id(sub):
    # 로그인한 user의 table id 값 받아오기
    sql = "SELECT `id` FROM `user_info` WHERE `sub` = %s"
    cursor.execute(sql, (sub, ))
    user_id = cursor.fetchone()[0]
    return user_id

def check_family_info(family_id):
    check_family_info_sql = "SELECT * FROM `family_info` WHERE `id` = %s"
    cursor.execute(check_family_info_sql, (family_id, ))
    result = cursor.fetchone()
    return result

def get_vaccine_info_check(user_id, family_id):
    if family_id == 0:
        all_vaccine_check_sql = "SELECT * FROM `get_vaccine` WHERE `family_info_id` is NULL and `user_info_id` = %s"
        cursor.execute(all_vaccine_check_sql, (user_id, ))
    else:
        all_vaccine_check_sql = "SELECT * FROM `get_vaccine` WHERE `family_info_id` = %s and `user_info_id` = %s"
        cursor.execute(all_vaccine_check_sql, (family_id, user_id))
    all_vaccine_check = cursor.fetchall()
    return all_vaccine_check

def get_vaccine_table_default(user_id, family_id):
    for i in range(1, 14):
        if family_id == 0:
            all_vaccine_sql = "INSERT INTO `get_vaccine` (`get_vaccine`, `user_info_id`, `vaccine_id`) VALUES (%s, %s, %s)"
            cursor.execute(all_vaccine_sql, (0, user_id, i))
        else:
            all_vaccine_sql = "INSERT INTO `get_vaccine` (`get_vaccine`, `family_info_id`, `user_info_id`, `vaccine_id`) VALUES (%s, %s, %s, %s)"
            cursor.execute(all_vaccine_sql, (0, family_id, user_id, i))
        conn.commit()

def save_vaccine_info(date, user_id, family_id, vaccine_id):
    if family_id == 0:
        get_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = %s WHERE `family_info_id` is NULL and `user_info_id` = %s and `vaccine_id` = %s"
        cursor.execute(get_vaccine_sql, (date, 1, user_id, vaccine_id))
    else:
        get_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
        cursor.execute(get_vaccine_sql, (date, 1, family_id, user_id, vaccine_id))
    conn.commit()

def update_vaccine_info(previous_date, date, user_id, family_id, vaccine_id):
    if family_id == 0:
        get_previous_vaccine_sql = "SELECT `id` FROM `get_vaccine` WHERE `get_date` = %s"
        cursor.execute(get_previous_vaccine_sql, (previous_date, ))
        prev_date_id = cursor.fetchone()[0]
        print('prev_date_id: ', prev_date_id)
        reset_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = 0 WHERE `id` = %s"
        cursor.execute(reset_vaccine_sql, (None, prev_date_id ))
        get_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = %s WHERE `family_info_id` is NULL and `user_info_id` = %s and `vaccine_id` = %s "
        cursor.execute(get_vaccine_sql, (date, 1, user_id, vaccine_id))
    else:
        get_previous_vaccine_sql = "SELECT `id` FROM `get_vaccine` WHERE `get_date` = %s"
        cursor.execute(get_previous_vaccine_sql, (previous_date, ))
        prev_date_id = cursor.fetchone()[0]
        print('prev_date_id: ', prev_date_id)
        reset_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = 0 WHERE `id` = %s"
        cursor.execute(reset_vaccine_sql, (None ,prev_date_id))
        get_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %s, `get_vaccine` = %s WHERE `family_info_id` = %s and `user_info_id` = %s and `vaccine_id` = %s"
        cursor.execute(get_vaccine_sql, (date, 1, family_id, user_id, vaccine_id))
    conn.commit()

def delete_vaccine_info(event_date, user_id, family_id):
    if family_id == 0:
        search_date_sql = "SELECT `id` FROM `get_vaccine` WHERE `get_date` = %s and `family_info_id` = %s and `get_vaccine` = 1"
        cursor.execute(search_date_sql, (event_date + " 00:00:00", family_id))
        search_date = cursor.fetchall()
        print("search_date: ", search_date)
        if search_date != []:
            for i in search_date:
                delete_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %, `get_vaccine` = %s WHERE `id` = %s"
                cursor.execute(delete_vaccine_sql, (None, 0, i))
    elif family_id != 0:
        search_date_sql = "SELECT `id` FROM `get_vaccine` WHERE `get_date` = %s and `family_info_id` is Null  and `user_info_id` = %s and `get_vaccine` = 1"
        cursor.execute(search_date_sql, (event_date + " 00:00:00", user_id))
        search_date = cursor.fetchall()
        print("search_date: ", search_date)
        if search_date != []:
            for i in search_date:
                delete_vaccine_sql = "UPDATE `get_vaccine` SET `get_date` = %, `get_vaccine` = %s WHERE `id` = %s"
                cursor.execute(delete_vaccine_sql, (None, 0, i))
    conn.commit()
