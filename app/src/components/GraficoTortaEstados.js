import React from 'react';

export default function GraficoTortaEstados({ leads, title = "📊 Distribución por Estado" }) {
  // Calcular datos
  const nuevos = leads.filter(lead => lead.estado === 'NUEVO').length;
  const vendidos = leads.filter(lead => lead.estado === 'VENDIDO').length;
  const rechazados = leads.filter(lead => lead.estado === 'RECHAZADO').length;
  const total = leads.length;

  // Calcular porcentajes
  const porcentajeNuevos = total > 0 ? (nuevos / total) * 100 : 0;
  const porcentajeVendidos = total > 0 ? (vendidos / total) * 100 : 0;
  const porcentajeRechazados = total > 0 ? (rechazados / total) * 100 : 0;

  // Calcular angulos para el gráfico de torta (en grados)
  const anguloNuevos = (porcentajeNuevos / 100) * 360;
  const anguloVendidos = (porcentajeVendidos / 100) * 360;
  const anguloRechazados = (porcentajeRechazados / 100) * 360;

  //
  const crearArco = (startAngle, endAngle, color, radius = 80) => {
    const centerX = 100;
    const centerY = 100;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">{title}</h3>
      
      {total > 0 ? (
        <>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                {porcentajeNuevos > 0 && (
                  <path
                    d={crearArco(currentAngle, currentAngle + anguloNuevos, '#3B82F6')}
                    fill="#3B82F6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                )}
                
                {porcentajeVendidos > 0 && (
                  <path
                    d={crearArco(currentAngle + anguloNuevos, currentAngle + anguloNuevos + anguloVendidos, '#10B981')}
                    fill="#10B981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                )}
                
                {porcentajeRechazados > 0 && (
                  <path
                    d={crearArco(currentAngle + anguloNuevos + anguloVendidos, currentAngle + anguloNuevos + anguloVendidos + anguloRechazados, '#EF4444')}
                    fill="#EF4444"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                )}
                
                <circle cx="100" cy="100" r="40" fill="#ffffff" />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Nuevos: {nuevos} ({porcentajeNuevos.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Vendidos: {vendidos} ({porcentajeVendidos.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Rechazados: {rechazados} ({porcentajeRechazados.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" />
              <circle cx="100" cy="100" r="40" fill="#ffffff" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">0</p>
                <p className="text-xs text-gray-400">Sin datos</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}