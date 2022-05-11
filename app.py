from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.vnobi.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

# 메인 페이지 - 이병수
@app.route("/api/posts", methods=["GET"])
def posts_get():
    posts_list = list(db.posts.find({}, {'_id': False}))

    return jsonify({'posts':posts_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)