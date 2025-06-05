// Dashboard.js - Componente unificado para Admin y Vendedor
import React, { useState, useEffect } from 'react';
import Card from './Card';
import CuadroLeads from './CuadroLeads';
import GraficoTortaEstados from './GraficoTortaEstados';
import GraficoLineaTemporal from './GraficoLineaTemporal';

export default function Dashboard({ user, onLogout }) {
  const [info, setInfo] = useState({ leads: 0, ventas: 0 });
  const [leadsData, setLeadsData] = useState([]);
  const [ventasData, setVentasData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.is_admin;
  
  const config = {
    title: isAdmin ? 'Dashboard Admin' : 'Dashboard Vendedor',
    subtitle: isAdmin ? 'Administrador' : 'Vendedor',
    cardsTitle: {
      leads: isAdmin ? 'Leads totales' : 'Mis Leads',
      ventas: isAdmin ? 'Ventas totales' : 'Mis Ventas'
    },
    graphTitles: {
      torta: isAdmin ? '📊 Estados de Todos los Leads' : `📊 Mis Estados - ${user.username}`,
      barras: isAdmin ? '📈 Evolución Diaria General' : `📈 Mi Evolución Diaria`,
      leads: isAdmin ? '📊 Todos los Leads' : `📋 Mis Leads Recientes - ${user.username}`
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        
        const res = await fetch('http://127.0.0.1:5001/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setInfo(data.info);
          setLeadsData(data.leads_data || []);
          setVentasData(data.ventas_data || []);
        } else {
          console.error('Error en la respuesta:', res.status);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-gray-600">Bienvenido, {user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title={config.cardsTitle.leads} value={info.leads} />
          <Card title={config.cardsTitle.ventas} value={info.ventas} />       
          <Card 
            title="Tasa de conversión" 
            value={info.leads > 0 ? `${((info.ventas / info.leads) * 100).toFixed(1)}%` : '0%'} 
          />          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GraficoTortaEstados 
            leads={leadsData} 
            title={config.graphTitles.torta}
          />
          <GraficoLineaTemporal 
            leads={leadsData} 
            ventas={ventasData}
            title={config.graphTitles.barras}
          />
        </div>

        <CuadroLeads 
          leads={leadsData} 
          title={config.graphTitles.leads} 
        />

        <div className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Información del Usuario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Tipo:</strong> {config.subtitle}</p>
            <p><strong>Total Leads:</strong> {info.leads}</p>
            <p><strong>Total Ventas:</strong> {info.ventas}</p>
          </div>
        </div>
      </div>
    </div>
  );
}