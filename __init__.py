from flask import Flask
# from flask_pymongo import PyMongo
from .views import views
from .auth import auth
# from .db import *


# db = PyMongo()

def create_app():
    app = Flask(__name__, static_url_path='/static')

    # db.init_app(app)

    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(views, url_prefix='/')

    return app
