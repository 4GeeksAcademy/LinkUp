"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, redirect, url_for, session, Blueprint
from authlib.integrations.flask_client import OAuth
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

load_dotenv() #cargamos las variables de entorno
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
app.secret_key = os.getenv("SECRET_KEY")


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Configurar Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.getenv("CLIENT_ID"), # guardado en archivo .env
    client_secret=os.getenv("CLIENT_SECRET"), # guardado en archivo .env
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params={'scope': 'openid email profile'},
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


# ruta para iniciar sesion con OAuth de Google
@api.route("/login_google", methods=["POST"])
def login_google():
    try:
        data= request.get_json()
        token_id = data.get("tokenId")

        if not token_id:
            return jsonify({"error": "Token no proporcionado"}),400
        
        user_info= google.parse_id_token({"id_token": token_id})

        if not user_info:
            return jsonify ({"error": "token invalido"}), 401
        
        username = user_info["email"]
        user = User.query.filter_by(username=username).first()

        if not user:
            user=User(username=username)
            db.session.add(user)
            db.session.commit()

        session["user"] = user_info

        return jsonify({"message": " Inicio de sesion exitoso", "user": user_info}), 200


    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return jsonify({
            "error": "Error durante el inicio de sesión",
            "details": str(e)}), 500


#ruta a la que nos redirige Google tras iniciar sesion
@api.route('/login/callback')
def callback():
    token = google.authorize_access_token() #datos token
    user_info = google.parse_id_token(token) #datos del usuario

    session['user'] = user_info #guardamos datos del usuario

    return redirect (f"https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/private") #nos redirige a pagina princial del usuario


#Obtener info del usuario
@api.route("/user")
def get_user():
    user = session.get("user")
    if user:
        return jsonify(user)
    return jsonify({"message": "Not logged in"}), 401

#Logout session google-user
@api.route("/logout")
def logout():
    session.pop("user",None)
    return redirect (f"https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/home")
@api.route("/authorize/google", methods=["POST"])
def authorize_google():
    try:
         token = google.authorize_access_token()
         user_info= google.parse_id_token(token)

         if not user_info or 'email' not in user_info:
             return "no EMAIL found", 400    
         username = user_info['email']
         user =User.query.filter_by(username = username).first()

         if not user:
          user=User(username=username)
         db.session.add(user)
         db.session.commit()

         session['username']= username
         session['oauth_token'] = token

         return redirect("https://cautious-chainsaw-rj44xx4w449f5wxg-3000.app.github.dev/private")
    except Exception as e:
        app.logger.error(f"Error during authorization: {str(e)}")
        return "error During authorization",500