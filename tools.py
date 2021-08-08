from flask import (
    Flask,
    flash,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    url_for,
)


app = Flask(__name__)


@app.route("/hello")
def hello():
    return "<p>Hello</p>"


@app.route("/index")
@app.route("/")
def index():
    return render_template("index.html")
