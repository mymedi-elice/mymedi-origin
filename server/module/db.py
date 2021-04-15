# import pymysql
# from config import DATABASE

# # 나중에 config 파일에 db 연결에 대한 정보를 넣어서 비공개로 전환하기
# class Database():
#     def __init__(self):
#         self.db= pymysql.connect(
#             host=DATABASE['host'],
#             user=DATABASE['user'],
#             port=DATABASE['port'],
#             db=DATABASE['db'],
#             charset='utf8',
#             autocommit = True
#             )
#         self.cursor= self.db.cursor(pymysql.cursors.DictCursor)

#     def execute(self, query, args={}):
#         self.cursor.execute(query, args)

#     def executeOne(self, query, args={}):
#         self.cursor.execute(query, args)
#         row= self.cursor.fetchone()
#         return row

#     def executeAll(self, query, args={}):
#         self.cursor.execute(query, args)
#         row= self.cursor.fetchall()
#         return row

#     def commit(self):
#         self.db.commit()


from mysql.connector import Error
from mysql.connector import pooling

try:
    connection_pool = pooling.MySQLConnectionPool(pool_name="pool",
                                                  pool_size=10,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='mymedi',
                                                  user='root',
                                                  charset="utf8",
                                                  password="0000",
                                                  connection_timeout=30
                                                  )

    print("Printing connection pool properties ")
    print("Connection Pool Name - ", connection_pool.pool_name)
    print("Connection Pool Size - ", connection_pool.pool_size)

    # Get connection object from a pool
    connection_object = connection_pool.get_connection()

    if connection_object.is_connected():
        db_Info = connection_object.get_server_info()
        print("Connected to MySQL database using connection pool ... MySQL Server version on ", db_Info)

        cursor = connection_object.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("Your connected to - ", record)

except Error as e:
    print("Error while connecting to MySQL using Connection pool ", e)
finally:
    # closing database connection.
    if connection_object.is_connected():
        cursor.close()
        connection_object.close()
        print("MySQL connection is closed")
