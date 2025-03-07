from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique= True, nullable= False)
    email = db.Column(db.String(120), unique=True)
    encode_password = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    avatar = db.Column(db.String(500), nullable=True)



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
    
class Group(db.Model):
    id = db.Column(db.String(30), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    iconURL = db.Column(db.String(255), nullable=False, default="https://cdn-icons-png.flaticon.com/512/74/74577.png")
    membersList = db.relationship('Member', backref='group', lazy=True)
    expensesList = db.Column(db.PickleType, nullable=True, default=[])

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owes = db.Column(db.Float, default=0)
    group_id = db.Column(db.String(15), db.ForeignKey('group.id'), nullable=False)