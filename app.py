from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.ksf61.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def main():
    return render_template('membership.html')

@app.route("/memberships", methods=["POST"])
def membership_post():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    rpw_receive = request.form['rpw_give']
    doc = {
        'id': id_receive,
        'pw': pw_receive,
        'rpw': rpw_receive
    }
    db.membership.insert_one(doc)

    return jsonify({'msg':'회원가입 완료'})

# @app.route("/stock", methods=["GET"])
#def homework_get():
#    comment_list = list(db.homework.find({}, {'_id': False}))
#    return jsonify({'comments':comment_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)