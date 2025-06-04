import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function DashboardAdmin({ user, onLogout }) {
  const [info, setInfo] = useState({ leads: 0, ventas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const res = await fetch('http://127.0.0.1:5001/dashboard-admin', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setInfo(data.info);
        }
      } catch (err) {
        console.error('Error:', err);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await fetch('http://127.0.0.1:5001/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error logout:', err);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Bienvenido, {user.username}</p>
            {user.is_admin && <span className="text-green-600 text-sm">Admin</span>}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title={"Leads totales"} value={info.leads} ></Card>
            <Card title={"Ventas totales"} value={info.ventas} ></Card>       
            <Card title={"Tasa de conversión"} value={info.leads > 0 ? `${((info.ventas / info.leads) * 100).toFixed(1)}%` : '0%'} ></Card>          
        </div>

        <div className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Información del Usuario</h3>
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Tipo:</strong> {user.is_admin ? 'Administrador' : 'Usuario'}</p>
        </div>
      </div>
    </div>
  );
}