from flask import Flask, request, jsonify
from models import db, User, Lead, Venta
from flask_cors import CORS
import os
import secrets

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'mydb.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Almacenar tokens activos en memoria (simple)
active_tokens = {}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        # Crear token simple
        token = secrets.token_urlsafe(32)
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
        return jsonify({"error": "Credenciales inválidas"}), 401

@app.route('/dashboard-ven', methods=['GET'])
def dashboard_ven():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token not in active_tokens:
        return jsonify({"error": "Token inválido"}), 401
    
    user_data = active_tokens[token]
    username = user_data['username']
    
    # Solo vendedores pueden acceder
    if user_data.get('is_admin', False):
        return jsonify({"error": "Acceso denegado"}), 403
    
    # Obtener estadísticas del vendedor
    leads = Lead.query.filter_by(user_id=username)
    ventas = Venta.query.filter_by(user_id=username)
        # Usar los métodos serialize que ya tienes
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

@app.route('/dashboard-admin', methods=['GET'])
def dashboard_admin():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token not in active_tokens:
        return jsonify({"error": "Token inválido"}), 401
    
    user_data = active_tokens[token]

    try:
        # Obtener TODOS los leads y ventas
        leads = Lead.query.all()
        ventas = Venta.query.all()
        
        # Usar los métodos serialize que ya tienes
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

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if token in active_tokens:
        del active_tokens[token]
    
    return jsonify({"message": "Logout exitoso"}), 200

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(
        username=data.get('username'),
        password=data.get('password'),
        is_admin=data.get('is_admin', False)
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Usuario creado"}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)