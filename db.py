from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError


def get_database_connection(connection_string):
    try:
        client = MongoClient(connection_string)
        print(client.server_info())
        client.server_info()
    except ServerSelectionTimeoutError as err:
        print(err)
    return client
