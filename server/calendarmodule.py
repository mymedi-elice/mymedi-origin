# google calendar
from __future__ import print_function
import datetime
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from config import CLIENT_SECRETS_FILE

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
        if not events:
            msg = "There are no events"
            return msg
        else:
            for event in events:
                temp = {}
                event_id = event['id']; temp['id'] = event_id
                datetime = event['start'].get('dateTime', event['start'].get('date'))
                try:
                    colorId = color_hexcode(event['colorId'])
                except:
                    colorId = "#039be5"
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
    temp['id'] = inserted_event['id']; temp['colorId'] = hexcode; temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
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
    temp['id'] = update_id; temp['colorId'] = hexcode; temp['summary'] = summary; temp['location'] = location; temp['description'] = description; temp['date'] = date; temp['time'] = time
    updated_event = service.events().update(calendarId = 'primary', eventId = update_id, body = update_event).execute()
    return temp
