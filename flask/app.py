from flask import Flask, request, jsonify
from models import db, User, Lead, Venta
from flask_cors import CORS
import os
import secrets


app = Flask(__name__)
CORS(app)

# config db sqlite
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'mydb.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

active_tokens = {}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        # crear token 
        token = secrets.token_urlsafe(32)

        # agrega token al dict
        active_tokens[token] = {
            'username': user.username,
            'is_admin': user.is_admin
        }
        
        return jsonify({
            "message": f"Bienvenido, {username}!",
            "token": token,
            "user": {
                "username": user.username,
                "is_admin": user.is_admin
            }
        }), 200
    else:
        return jsonify({"error": "credenciales invalidas!"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token in active_tokens:
        del active_tokens[token]
    
    return jsonify({"message": "Logout exitoso"}), 200


@app.route('/dashboard', methods=['GET'])
def dashboard():

    #chequea si token esta en el dict
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token not in active_tokens:
        return jsonify({"error": "token invalido!"}), 401
    
    user_data = active_tokens[token]
    username = user_data['username']
    is_admin = user_data.get('is_admin', False)
    
    try:
        # si es admin trae todos los leads ordenados x fecha , de mas a menos recientes
        if is_admin:
            leads = Lead.query.order_by(Lead.fecha_creacion.desc()).all()
            ventas = Venta.query.order_by(Venta.fecha.desc()).all()

        # si es vendedor, solo trae sus leads /ventas
        else:
            leads = Lead.query.filter_by(user_id=username).order_by(Lead.fecha_creacion.desc()).all()
            ventas = Venta.query.filter_by(user_id=username).order_by(Venta.fecha.desc()).all()
        
        leads_data = [lead.serialize() for lead in leads]
        ventas_data = [venta.serialize() for venta in ventas]
        
        return jsonify({
            "user": user_data,
            "info": {
                "leads": len(leads_data),
                "ventas": len(ventas_data)
            },
            "leads_data": leads_data,
            "ventas_data": ventas_data
        }), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error interno"}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)