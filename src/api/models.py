from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique= True, nullable= False)
    email = db.Column(db.String(120), unique=True)
    encode_password = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    avatar = db.Column(db.String(500), nullable=True)  # direccion url o lugar donde se encuentra "importante"



    def __repr__(self):
        return f'<User {self.username}>'
    
    
    def set_password(self, password):
        self.encode_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.encode_password, password)  # retorna True o False si son correctas o no lo son


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            # do not serialize the password, its a security breach
        }
    
        