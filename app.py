# import requests
# from bs4 import BeautifulSoup
#
# headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
# data = requests.get('https://www.inflearn.com/course/age-of-vuejs',headers=headers)
#
# soup = BeautifulSoup(data.text, 'html.parser')
#
# lecture = soup.select_one('#main > section > div.cd-sticky-wrapper > div.cd-header.cd-header__not-owned-course > div > div > div.cd-header__left.ac-cd-5.ac-ct-12 > div > div > img')['src']
#
# print(lecture)

# lectures = soup.select('#courses_section > div > div > div > main > div.courses_container > div > div')
#
# for lecture in lectures:
#     lectureImg = lecture.select_one('div > a > div.card-image > figure > img')['src']
#
#     print(lectureImg)


from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.vnobi.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

# @app.route("/homework", methods=["POST"])
# def homework_post():
#     name_receive = request.form['name_give']
#     comment_receive = request.form['comment_give']
#     doc = {
#         'name': name_receive,
#         'comment': comment_receive,
#     }
#     db.homework.insert_one(doc)
#
#     return jsonify({'msg':'응원 남기기 성공!!'})
#
# @app.route("/homework", methods=["GET"])
# def homework_get():
#     comment_list = list(db.homework.find({}, {'_id': False}))
#     return jsonify({'comments':comment_list})

# 메인 페이지 - 이병수
@app.route("/api/posts", methods=["GET"])
def posts_get():
    posts_list = list(db.posts.find({}, {'_id': False}))

    return jsonify({'posts':posts_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)







