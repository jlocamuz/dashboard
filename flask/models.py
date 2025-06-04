from flask_sqlalchemy import SQLAlchemy
from datetime import date
import enum

db = SQLAlchemy()

class EstadoLead(enum.Enum):
    NUEVO = "NUEVO"
    VENDIDO = "VENDIDO" 
    RECHAZADO = "RECHAZADO"

class User(db.Model):
    __tablename__ = 'users'

    username = db.Column(db.String(100), primary_key=True)  
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    leads = db.relationship('Lead', backref='user', lazy=True, 
                            primaryjoin="User.username == Lead.user_id")
    ventas = db.relationship('Venta', backref='user', lazy=True, 
                             primaryjoin="User.username == Venta.user_id")

    def __repr__(self):
        return f'<User {self.username}>'

class Lead(db.Model):
    __tablename__ = 'leads'

    id = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.Enum(EstadoLead), default=EstadoLead.NUEVO, nullable=False)
    fecha_creacion = db.Column(db.Date, default=date.today)

    user_id = db.Column(db.String(100), db.ForeignKey('users.username'), nullable=False)  

    venta = db.relationship('Venta', backref='lead', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'estado': self.estado.value,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'user_id': self.user_id
        }

class Venta(db.Model):
    __tablename__ = 'ventas'

    id = db.Column(db.Integer, primary_key=True)
    monto = db.Column(db.Float, default=0.0)
    fecha = db.Column(db.Date, default=date.today)

    user_id = db.Column(db.String(100), db.ForeignKey('users.username'), nullable=False)  
    lead_id = db.Column(db.Integer, db.ForeignKey('leads.id'), nullable=False, unique=True)

    def serialize(self):
        return {
            'id': self.id,
            'monto': self.monto,
            'fecha': self.fecha.isoformat() if self.fecha else None,
            'user_id': self.user_id,
            'lead_id': self.lead_id
        }