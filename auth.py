from flask import Blueprint, render_template, request, jsonify
from flask_bcrypt import Bcrypt
from .db import get_database_connection
import re
import jwt
from datetime import datetime, timedelta
from os import getenv

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()
client = get_database_connection(getenv('connection_string'))
db = client["waggly-dev-ui-app-server"]
users_collection = db['users']
registerDog_collection = db['dog']
registerWalker_collection = db['walker']

SECRET_KEY = 'secret_key_jwt'


# Extract data from request
@auth.route('/login', methods=['POST'])
def loginUser():
    if request.method == 'POST':

        print(request.content_type)

        loginEmail = request.form.get('loginEmail')
        loginPassword = request.form.get('loginPassword')

        if not all([loginEmail, loginPassword]):
            return jsonify({'error': 'All fields are required'}), 400

        # query the db for user
        user = users_collection.find_one({'registerEmail': loginEmail})

        if user and bcrypt.check_password_hash(user['registerPassword'], loginPassword):
            # generate token
            token = jwt.encode({'loginEmail': loginEmail, 'exp': datetime.utcnow() + timedelta(minutes=30)},
                               'SECRET_KEY')
            return jsonify({'token': token, 'success': True})

        else:
            return jsonify({'error': 'Invalid email or password'}), 401


@auth.route('/login', methods=['GET'])
def displayLoginForm():
    return render_template("login.html")


@auth.route('/logout')
def logout():
    return render_template("base.html")


@auth.route('/register', methods=['GET', 'POST'])
def register_user():
    if request.method == 'POST':

        print(request.content_type)

        # Extract the registration data from the JSON object
        registerEmail = request.form.get('registerEmail')
        registerPassword = request.form.get('registerPassword')
        confirmPassword = request.form.get('confirmPassword')

        if not all([registerEmail, registerPassword, confirmPassword]):
            return jsonify({'error': 'All fields are required'}), 400

        # Validation and registration logic
        if registerEmail is None or not isinstance(registerEmail, str):
            error_message = 'Invalid email.'
            return jsonify(error=error_message), 400

        if registerPassword is None or not isinstance(registerPassword, str):
            error_message = 'Invalid password.'
            return jsonify(error=error_message), 400

        if confirmPassword is None or not isinstance(confirmPassword, str):
            error_message = 'Invalid confirmation password.'
            return jsonify(error=error_message), 400

        # Validate email format
        if not re.match(r'^\w+@\w+\.\w+$', registerEmail):
            error_message = 'Invalid email format.'
            return jsonify(error=error_message), 400

        # Validate password length
        if len(registerPassword) < 8:
            error_message = 'Password must be at least 8 characters long.'
            return jsonify(error=error_message), 400

        # Check if passwords match
        if registerPassword != confirmPassword:
            error_message = 'Passwords do not match.'
            return jsonify(error=error_message), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(registerPassword).decode('utf-8')

        # Insert user into database
        users_collection.insert_one({'registerEmail': registerEmail, 'registerPassword': hashed_password})

        return jsonify(message="Registration successful"), 200

    elif request.method == 'GET':
        # Handling GET requests
        return render_template("register.html")

    return jsonify(error="Method not allowed"), 405


@auth.route('/register_dog', methods=['POST'])
def registerDog():
    if request.method == 'POST':
        print(request.content_type)

        dogName = request.form.get('dogName')
        breed = request.form.get('breed')
        age = request.form.get('age')
        ownersName = request.form.get('ownersName')
        ownerPhone = request.form.get('ownerPhone')

        if not all([dogName, breed, age, ownersName, ownerPhone]):
            return jsonify({'error': 'All fields are required'}), 400

        if len(dogName) > 50 or len(breed) > 50 or len(ownersName) > 100:
            return jsonify({'error': 'Exceeds maximum length allowed.'}), 400

        # insert into db
        registerDog_collection.insert_one(
            {'dogName': dogName, 'breed': breed, 'age': age, 'ownersName': ownersName, 'ownerPhone': ownerPhone})

        return jsonify(message="Dog Registered Successfully!")


@auth.route('/register_dog', methods=['GET'])
def displayRegisterForm():
    return render_template("register_dog.html")


@auth.route('/register_walker', methods=['POST'])
def registerWalker():
    if request.method == 'POST':
        print(request.content_type)

        fullName = request.form.get('fullName')
        emailAddress = request.form.get('emailAddress')
        experience = request.form.get('experience')
        available = request.form.get('available')

        if not all([fullName, emailAddress, experience, available]):
            return jsonify({'error': 'All fields are required'}), 400

        # insert into db
        registerWalker_collection.insert_one(
            {'fullName': fullName, 'emailAddress': emailAddress, 'experience': experience, 'available': available})

        return jsonify(message="Walker Registered Successfully!"), 200


@auth.route('/register_walker', methods=['GET'])
def displayWalkerForm():
    return render_template("register_walker.html")


@auth.route('/home')
def home():
    return render_template("home.html")
