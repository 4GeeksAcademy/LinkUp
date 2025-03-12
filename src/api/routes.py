"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
import os
import random
import string
import uuid
from flask_sqlalchemy import SQLAlchemy
import math
from sqlalchemy.exc import IntegrityError

from flask import Flask, request, jsonify, redirect, url_for, session, Blueprint, abort
from authlib.integrations.flask_client import OAuth
from api.models import db, User, Group, Expense, Member, Balance
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary
import cloudinary.uploader



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


load_dotenv() #cargamos las variables de entorno
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, origins="*", supports_credentials=True) 



# Cofiguracion para mandar imagen a traves de Api local a Cloudinary
cloudinary.config( 
  cloud_name = "fotolinkup", 
  api_key = "942267699618169", 
  api_secret = "UxfxJAEz1XMsStkRMgIzUq810Ps",
  secure=True
)

def generate_group_id():
    while True:
        group_id = ''.join(random.choices(string.ascii_letters + string.digits, k=15))
        existing_group = Group.query.get(group_id)
        if not existing_group:
            return group_id 



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
    access_token = create_access_token(identity= email)
    user = User(username=username, email=email, is_active=True)
    user.set_password(password) 
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg":"Usuario creado correctamente",
                     "token": access_token, 
                     "username": user.username,
                     "email": email}),201


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
    
    access_token = create_access_token(identity= user_email)

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
        print("Imagen avatar ", picture)

        if not email:
            return jsonify({"error": "No se obtuvo el email"}), 400
        
        

        # Buscar o crear usuario en la base de datos
        user = User.query.filter_by(email=email).first()
        
        if not user:
            user = User(username=name, email=email, is_active=True, avatar=picture)
            
            db.session.add(user)
            db.session.commit()

        
        # # Crear token de acceso
        access_token = create_access_token(identity=user.email)

        return jsonify({
            "msg": "Inicio de sesión exitoso",
            "token": access_token,
            "username": user.username,
            "email": user.email,
            "picture": user.avatar
        }), 201

    except Exception as e:
        app.logger.error(f"Error en signup_google: {str(e)}")
        return jsonify({"error": "Error durante la autenticación con Google"}), 500


#Obtener info del usuario
@api.route('/user', methods=["POST"])
@jwt_required()
def get_user():
    
    user_email = get_jwt_identity()
    
    
    user = User.query.filter_by(email=user_email).first()
    if user:
        return jsonify({
        
        "username": user.username,
        "email": user.email,
        "picture": user.avatar}), 200
   
    print("Usuario no encontrado en la base de datos.")    
    return jsonify({"message": "Usuario no encontrado"}), 401


@api.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    try:
        user_email = get_jwt_identity()
        print(f"Usuario autenticado: {user_email}")

        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
    
        file = request.files["file"] 
        result = cloudinary.uploader.upload(file) #subimos imagen al servidor Cloudinary

        url_foto = result["secure_url"] 


        return jsonify({"url_foto": url_foto}), 201  

    except Exception as e:
        return jsonify({"error": f"Error al subir imagen: {str(e)}"}), 500
    
  


#Logout session google-user
@api.route('/logout')
def logout():
    
    session.pop("user",None)
    return redirect ("/")













#GROUPS
def generate_group_id():
    if Group.query.count() == 0:
        return ''.join(random.choices(string.ascii_letters + string.digits, k=15))
    
    while True:
        group_id = ''.join(random.choices(string.ascii_letters + string.digits, k=15))
        existing_group = Group.query.get(group_id)
        if not existing_group:
            return group_id




@api.route('/groups', methods=['POST'])
def create_group():
    data = request.get_json()  # Se obtiene el cuerpo en formato JSON
    print("Datos recibidos:", data)

    # Verifica que se esté recibiendo el contenido correctamente
    if not data:
        return jsonify({"message": "No JSON data received"}), 415

    name = data.get('name')
    iconURL = data.get('iconURL')
    membersList = data.get('membersList')

    if not name:
        return jsonify({"message": "Group name is required"}), 400
    if not membersList or len(membersList) <= 2:
        return jsonify({"message": "A group must have at least two members"}), 400

    group_id = generate_group_id()
    print("El id del grupo creado:",group_id)
    
    group = Group(name=name, iconURL=iconURL, id=group_id)

        
    for member_data in membersList:
        member = Member(name=member_data['name'], group=group)
        db.session.add(member)

    db.session.add(group)
    db.session.commit()

    return jsonify({"message": "Group created successfully", "id": group_id}), 201




@api.route('/groups', methods=['GET'])
def get_groups():
    groups = Group.query.all()
    groups_list = []

    for group in groups:

        groups_list.append({
            "name": group.name,
            "id": group.id,
            })

    return jsonify({"groups": groups_list})

@api.route('/completGroups', methods=['GET'])
def get_completGroups():
    groups = Group.query.all()
    groups_list = []

    for group in groups:
        members = group.membersList
        members_data = [{"name": member.name, "owes": member.owes} for member in members]

        groups_list.append({
            "name": group.name,
            "id": group.id,
            "iconURL":group.iconURL,

            "membersList": members_data,

            })

    print("retorno desde getGroups", groups_list)
    return jsonify({"groups": groups_list})



@api.route('/group/<string:idgroup>', methods=['GET'])
def get_group(idgroup):
    group = Group.query.get(idgroup)
    if not group:
        return jsonify({"status": 404}), 404

    return jsonify({
        "name": group.name,
        "id": group.id,
        "iconURL": group.iconURL
    })



@api.route('/group/<string:idgroup>', methods=['DELETE'])
def delete_group(idgroup):
    group = Group.query.get(idgroup)
    if not group:
        return jsonify({"message": "Group not found"}), 404

    # Eliminar todos los balances asociados a los gastos del grupo
    for expense in group.expensesList:
        for balance in expense.balance:
            db.session.delete(balance)  # Eliminar los balances asociados
        db.session.delete(expense)  # Eliminar los gastos

    # Eliminar todos los miembros asociados al grupo
    for member in group.membersList:
        db.session.delete(member)

    # Eliminar el grupo
    db.session.delete(group)
    db.session.commit()

    return jsonify({"message": "Group deleted successfully"})



@api.route('/group/<string:idgroup>/members', methods=['GET'])
def get_members(idgroup):
    group = Group.query.get(idgroup)
    if not group:
        return jsonify({"message": "Group not found"}), 404
    members = group.membersList
    members_data = [{"id": member.id, "name": member.name, "owes": member.owes} for member in members]
    
    return jsonify({"members": members_data})









@api.route('/expenses/<group_id>', methods=['POST'])
def add_expense(group_id):
    # Obtener el grupo por su ID
    group = Group.query.get(group_id)
    if not group:
        print(f"Grupo con ID {group_id} no encontrado")
        return jsonify({"message": "Grupo no encontrado"}), 404
    
    # Obtener los datos del gasto desde la solicitud
    title = request.json.get('title')
    amount = request.json.get('amount')
    paid_for = request.json.get('paidFor')
    image_url = request.json.get('imageURL')
    date = request.json.get('date')
    balances = request.json.get('balance')
    
    print(f"Datos recibidos: {request.json}")  # Verifica que los datos estén correctos
    
    if not title or not amount or not paid_for or not balances:
        print("Faltan datos requeridos")
        return jsonify({"message": "Datos incompletos"}), 400
    
    # Crear el nuevo gasto
    new_expense = Expense(
        title=title,
        amount=amount,
        paidFor=paid_for,
        imageURL=image_url,
        date=date,
        group_id=group_id
    )
    
    db.session.add(new_expense)
    db.session.commit()

    # Añadir los balances a la base de datos
    for balance_data in balances:
        member_name = balance_data.get('name')
        print(f"Buscando miembro: {member_name}")
        member = Member.query.filter_by(name=member_name, group_id=group_id).first()
        if member:
            balance = Balance(
                name=member_name,
                amount=balance_data.get('amount'),
                member_id=member.id,
                expense_id=new_expense.id
            )
            db.session.add(balance)
        else:
            print(f"Miembro {member_name} no encontrado en el grupo")
            return jsonify({"message": f"Miembro {member_name} no encontrado en el grupo"}), 404

    db.session.commit()

    return jsonify({
        "message": "Gasto añadido exitosamente",
        "expense_id": new_expense.id
    }), 201



@api.route('/expenses', methods=['GET'])
def get_all_expenses():
    expenses = Expense.query.all()
    result = []
    
    for expense in expenses:
        expense_data = {
            "id": expense.id,
            "title": expense.title,
            "amount": expense.amount,
            "paidFor": expense.paidFor,
            "group_id": expense.group_id,
            
        }
        result.append(expense_data)

    return jsonify(result)

@api.route('/expenses/<string:group_id>', methods=['GET'])
def get_group_expenses(group_id):
    page = request.args.get('page', 1, type=int)
    per_page = 10

    # Ordenar por ID de forma descendente
    expenses_query = Expense.query.filter_by(group_id=group_id).order_by(Expense.id.desc())
    total_expenses = expenses_query.count()
    total_pages = math.ceil(total_expenses / per_page)

    expenses = expenses_query.paginate(page=page, per_page=per_page, error_out=False)

    data = {
        "expenses": [
            {
                "id": expense.id,
                "title": expense.title,
                "amount": expense.amount,
                "paidFor": expense.paidFor,
                "imageURL": expense.imageURL,
                "date": expense.date
            }
            for expense in expenses.items
        ],
        "current_page": page,
        "total_pages": total_pages,
        "next_page": f"/api/expenses/{group_id}?page={page + 1}" if expenses.has_next else None
    }

    return jsonify(data)


@api.route('/expense/<idexpense>', methods=['GET'])
def get_expense(idexpense):
    expense = Expense.query.get(idexpense)
    if not expense:
        return jsonify({"message": "Expense not found"}), 404
    
    balance_list = [{"name": b.name, "amount": b.amount} for b in expense.balance]
    
    return jsonify({
        "title": expense.title,
        "amount": expense.amount,
        "paidFor": expense.paidFor,
        "balance": balance_list,
        "imageURL": expense.imageURL,
        "date": expense.date
    })

@api.route('/expense/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    # Eliminar balances asociados
    Balance.query.filter_by(expense_id=expense_id).delete()

    # Eliminar la expense
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": f"Expense {expense_id} deleted successfully"}), 200


