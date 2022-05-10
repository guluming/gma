from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.jglaq.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

import requests
from bs4 import BeautifulSoup


@app.route('/')
def home():
    return render_template('index.html')


@app.route("/movie", methods=["POST"])
def movie_post():
    url_receive = request.form['url_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')
    og_description = soup.select_one('meta[property="og:description"]')

    image = og_image['content']
    title = og_title['content']
    description = og_description['content']

    doc = {
        'image': image,
        'title': title,
        'desc': description,
        'star': star_receive,
        'comment': comment_receive
    }

    db.movies.insert_one(doc)

    return jsonify({'msg': 'POST 연결 완료!'})


@app.route("/movie", methods=["GET"])
def movie_get():
    movies_list = list(db.movies.find({}, {'_id': False}))
    return jsonify({'movies': movies_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

# [백업]
# from flask import Flask, render_template, request, jsonify
#
# app = Flask(__name__)
#
# from pymongo import MongoClient
# client = MongoClient('mongodb+srv://test:sparta@cluster0.jglaq.mongodb.net/Cluster0?retryWrites=true&w=majority')
# db = client.dbsparta
#
# import requests
# from bs4 import BeautifulSoup
#
#
# @app.route('/')
# def home():
#     return render_template('index.html')
#
#
# @app.route("/lecture", methods=["GET"])
# def lecture_get():
#     return jsonify({})
#
# # @app.route('/')
# # def main():
# #     myname = "sparta"
# #     return render_template("index.html", name = myname)
#
#
# @app.route("/lecture", methods=["POST"])
# def lecture_post():
#     url_receive = request.form['url_give']
#     comment_receive = request.form['comment_give']
#     star_receive = request.form['star_give']
#     # tag_receive = request.form['tag_give']
#
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
#     data = requests.get(url_receive, headers=headers)
#
#     soup = BeautifulSoup(data.text, 'html.parser')
#
#     og_image = soup.select_one('meta[property="og:image"]')
#     # og_title = soup.select_one('meta[property="course_title"]')
#     # print(f"og_title = {og_title}")
#     og_description = soup.select_one('meta[property="og:description"]')
#
#     image = og_image['content']
#     # title = og_title['content']
#     description = og_description['content']
#     # print(f"image = {image}\n title = {title}\n description = {description}")
#
#     doc = {
#         'image': image,
#         # 'title': title,
#         'desc': description,
#         'star': star_receive,
#         'comment': comment_receive
#         # 'tag':
#     }
#
#     db.lecture.insert_one(doc)
#
#     return jsonify({'msg': '강의 업로드 완료!'})
#
#
# @app.route("/lecture", methods=["GET"])
# def lecture_get():
#     lectures_list = list(db.lectures.find({},{'_id':False}))
#     return jsonify({'lectures':lectures_list})
#
#
# if __name__ == '__main__':
#     app.run('0.0.0.0', port=5000, debug=True)
#
#
# # @app.route('/upload/<keyword>') # @app.route('/upload/<keyword>')
# # def detail(keyword):
# #     r = requests.get('http://openapi.seoul.go.kr:8088/6d4d776b466c656533356a4b4b5872/json/RealtimeCityAir/1/99')
# #     response = r.json()
# #     rows = response['RealtimeCityAir']['row']
# #     word_receive = request.args.get("word_give")  # request import 필요
# #     print(word_receive)
# #     return render_template("detail.html", rows=rows, word=keyword)
