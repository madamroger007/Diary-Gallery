import os
from os.path import join,dirname
from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")
DB_COLLECTION =  os.environ.get("DB_COLLECTION")


client = MongoClient(MONGODB_URI)

db = client[DB_NAME][DB_COLLECTION]

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/diary', methods=["GET"])
def showDiary():
    articles = list(db.find({}, {"_id":False}))
    
    return jsonify({
        "articles": articles,
    })

@app.route('/diary', methods=["POST"])
def SaveDiary():
    today = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

    file = request.files.get('file_give')
    profile = request.files.get('profile_give')
    title_receive = request.form.get('title_give')
    author_receive = request.form.get('author_give')
    descrip_receive = request.form.get('description_give')
    
    # File response
    extention = file.filename.split(".")[-1]
    filename =f"static/img/public/galery/post-{today}.{extention}"
    file.save(filename)

    # Profile response
    extention = profile.filename.split(".")[-1]
    profile_filename =f"static/img/public/profile/profile-{today}.{extention}"
    profile.save(profile_filename)

    doc = {
        'img' : filename,
        "profile" : profile_filename,
        'author': author_receive,
        'title': title_receive,
        'description': descrip_receive
    }
    db.insert_one(doc)
    return jsonify({
        "msg": "Succes received all Save"
    })



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
 