"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
import os
from flask import Flask, request, jsonify, redirect, url_for, session, Blueprint
from authlib.integrations.flask_client import OAuth
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


load_dotenv() #cargamos las variables de entorno
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True) 


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
            return redirect(url_for('api.login_google'))
        return f(*args, **kwargs)
    return decorated_funcion

# registro normal
@api.route('/signup', methods=["POST"])
def creando_usuario():
    username= request.json.get("username")
    email=request.json.get("email")
    password=  request.json.get("password")
    print(email)

    user = User.query.filter_by(email=email).first()
    print(user)
    if user:
        return jsonify({"msg": "El email introducido no es valido o ya se registro con anterioridad."}), 400

    user = User(username=username, email=email, is_active=True)
    user.set_password(password) 

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg":"Usuario creado correctamente"}),201

#login normal
@api.route('/login', methods=["POST"])
def acceso_usuario():
    username= request.json.get("username")
    password=  request.json.get("password")
    

    user = User.query.filter_by(username=username).first()
    print(user)
    if not user or not user.check_password(password):
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    user_email = user.email
    user_avatar =user.avatar if hasattr(user, 'avatar') else None

    access_token = create_access_token(identity=user.username)

    return jsonify({"msg": "Inicio de sesión exitoso",
                     "token": access_token, 
                     "username": user.username,
                     "email": user_email,
                     "avatar": user_avatar}), 200



# registro a traves de Google
@api.route('/signup_google', methods=['POST'])
def signup_google():
    try:
        request_body = request.json
        print(request_body)
        token_id = request_body.get("tokenId")
        
        

        if not token_id:
            return jsonify({"error": "Token no proporcionado"}), 400

        # Verificar token con Google
        
        response = requests.get("https://oauth2.googleapis.com/tokeninfo?id_token="+request_body["tokenId"])
        print(response)
        user_info = response.json()
        print(user_info)

        if "error_description" in user_info:
            return jsonify({"error": "Token inválido"}), 401

        # Extraemos datos del usuario
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")

        if not email:
            return jsonify({"error": "No se obtuvo el email"}), 400
        
        

        # Buscar o crear usuario en la base de datos
        user = User.query.filter_by(email=email).first()
        
        if not user:
            user = User(username=name, email=email, is_active=True)
            print(user)
            db.session.add(user)
            db.session.commit()

        print(type(user))
        # # Crear token de acceso
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "msg": "Inicio de sesión exitoso",
            "token": access_token,
            "username": user.username,
            "email": user.email,
            "picture": picture
        }), 201

    except Exception as e:
        app.logger.error(f"Error en signup_google: {str(e)}")
        return jsonify({"error": "Error durante la autenticación con Google"}), 500



# ruta toma de datos sesion con OAuth de Google
# 
@api.route('/login_google', methods=['POST'])
def login_google():
    try:
        data= request.get_json()
        token_id = data.get("tokenId")

        if not token_id:
            return jsonify({"error": "Token no proporcionado"}),400
        
        user_info = google.parse_id_token(token_id)

        if not user_info:
            return jsonify ({"error": "token no entregado"}), 400
        

        # Verificar token con Google
        google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token_id}"
        response = requests.get(google_url)
        if response.status_code != 200:
            return jsonify({"error": "Token inválido"}), 401
        

        email = user_info["email"]
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Usuario no registrado. Por favor, regístrese primero."}), 404 

        session["username"] = user_info["email"]

        return jsonify({"message": " Inicio de sesion exitoso", "user": user_info}), 201


    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return jsonify({
            "error": "Error durante el inicio de sesión",
            "details": str(e)}), 500

#Obtener info del usuario
@api.route('/user', methods=["POST"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200
        
    return jsonify({"message": "Usuario no encontrado"}), 401


    

   

    

#Logout session google-user
@api.route('/logout')
def logout():
    
    session.pop("user",None)
    return redirect ("/")


# @api.route("/authorize/google", methods=["POST"])
# def authorize_google():
#     try:
#          token = google.authorize_access_token()
#          user_info= google.parse_id_token(token)

#          if not user_info or 'email' not in user_info:
#              return "no EMAIL found", 400    
#          username = user_info['email']
#          user =User.query.filter_by(username = username).first()

#          if not user:
#           user=User(username=username)
#          db.session.add(user)
#          db.session.commit()

#          session['username']= username
#          session['oauth_token'] = token

#          return redirect("/")
#     except Exception as e:
#         app.logger.error(f"Error during authorization: {str(e)}")
#         return "error During authorization",500