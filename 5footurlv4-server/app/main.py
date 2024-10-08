from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db
import os
from firebase_admin import credentials
import json
#empty
cred_json = os.environ.get("FIREBASE_CREDENTIALS")
cred_dict = json.loads(cred_json)
cred_obj = credentials.Certificate(cred_dict)
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL': 'https://footurlv4-default-rtdb.firebaseio.com/'
    })

app = Flask(__name__, static_folder='./build/static', template_folder="./build")

@app.route("/")
def hello_world():
    return redirect("app")

@app.route("/app")
def homepage():
    return render_template('index.html')

@app.route('/<path:generatedKey>', methods=['GET'])
def fetch_from_firebase(generatedKey):
    ref = db.reference("/"+ generatedKey)
    data = ref.get()
    if not data:
        return '404 not found'
    else:
        longURL = data['longURL']
        return redirect(longURL)

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')
