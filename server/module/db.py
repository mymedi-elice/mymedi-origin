import pymysql

# 나중에 config 파일에 db 연결에 대한 정보를 넣어서 비공개로 전환하기
class Database():
    def __init__(self):
        self.db= pymysql.connect(
            host='localhost',
            user='root',
            port = 3306,
            db='mymedi',
            charset='utf8',
            autocommit = True
            )
        self.cursor= self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row= self.cursor.fetchone()
        return row

    def executeAll(self, query, args={}):
        self.cursor.execute(query, args)
        row= self.cursor.fetchall()
        return row

    def commit(self):
        self.db.commit()
