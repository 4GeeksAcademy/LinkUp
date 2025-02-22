"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""


import os
from flask import Flask, request, redirect, jsonify, url_for, session, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from functools import wraps



# from models import Person
load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
app.secret_key = os.getenv("SECRET_KEY")
print(os.getenv("SECRET_KEY"))

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)


# Configurar Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    client_kwargs={"scope": "openid email profile"},
)
# login required, añadir "@login_required" a todas la rutas que sean necesarias proteger con registro
def login_required(f):
    @wraps(f)
    def decorated_funcion(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login_google'))
        return f(*args, **kwargs)
    return decorated_funcion
# login session by OAuth-google-user
@app.route("/login_google")
def login():
    return google.authorize_redirect(url_for("authorize_google",_external=True))

# Authorize route
# @app.route("/authorize")
# def authorize():
#     token = google.authorize_access_token()
#     user_info = google.parse_id_token(token)
#     session["user"] = user_info
#     return redirect(url_for("home"))

# Get user authorization data
@app.route("/user")
def get_user():
    user = session.get("user")
    if user:
        return jsonify(user)
    return jsonify({"message": "Not possible authenticated"}), 401

#Logout session google-user
@app.route("/logout")
@login_required
def logout():
    session.pop("user",None)
    return redirect(url_for("home"))

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():    
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route("/login/google")
def login_google():
    try:
        redirect_uri= url_for('authorize_google', _external=True)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return "Error ocurring during login",500

@app.route("/authorize/google")

def authorize_google():
    

    token = google.authorize_access_token()
    userinfo_endpoind = google.server_metadata['userinfo_endpoind']


    if resp.status_code != 200:
        return "Error fetching user info", 500
    
    resp = google.get(userinfo_endpoind)
    user_info = resp.json()

    if not username:
        return "No email found", 400
    
    username = user_info['email']

    user =User.query.filter_by(username = username).first()
    if not user:
        user=User(username=username)
        db.session.add(user)
        db.session.commit
    session['username']= username
    session['oauth_token'] = token

    return redirect(url_for('../../private'))

# logig required, añadir "@login_required" a todas la rutas que sean necesarias proteger con registro
def login_required(f):
    @wraps(f)
    def decorated_funcion(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login_google'))
        return f(*args, **kwargs)
    return decorated_funcion


        






# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
