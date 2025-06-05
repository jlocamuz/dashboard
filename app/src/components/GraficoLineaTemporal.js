import React from 'react';

export default function GraficoBarrasFechas({ leads, ventas, title = "📊 Leads y Ventas por Fecha" }) {
  // 
  const procesarDatos = () => {
    const fechas = new Set();
    
    leads?.forEach(lead => fechas.add(lead.fecha_creacion));
    ventas?.forEach(venta => fechas.add(venta.fecha));
    
    const fechasOrdenadas = Array.from(fechas).sort();
    
    const datos = fechasOrdenadas.map(fecha => {
      const leadsCount = leads?.filter(lead => lead.fecha_creacion === fecha).length || 0;
      const ventasCount = ventas?.filter(venta => venta.fecha === fecha).length || 0;
      
      return {
        fecha,
        leads: leadsCount,
        ventas: ventasCount
      };
    });
    
    return datos;
  };

  const datos = procesarDatos();
  const maxValue = Math.max(...datos.map(d => Math.max(d.leads, d.ventas)), 1);
  const maxHeight = 200;

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">{title}</h3>
      
      {datos.length > 0 ? (
        <>

          <div className="mb-6">
            <div className="flex items-end justify-center space-x-4 h-64  rounded-lg p-4">
              {datos.map((item, index) => {
                const leadsHeight = (item.leads / maxValue) * maxHeight;
                const ventasHeight = (item.ventas / maxValue) * maxHeight;
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className="flex items-end space-x-1">
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 relative group"
                          style={{ height: `${leadsHeight}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.leads} leads
                          </div>
                        </div>
                        {item.leads > 0 && (
                          <span className="text-xs text-blue-600 font-medium mt-1">{item.leads}</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600 relative group"
                          style={{ height: `${ventasHeight}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.ventas} ventas
                          </div>
                        </div>
                        {item.ventas > 0 && (
                          <span className="text-xs text-green-600 font-medium mt-1">{item.ventas}</span>
                        )}
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-600 font-medium transform rotate-45 mt-2">
                      {formatearFecha(item.fecha)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Ventas</span>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Total: {datos.reduce((sum, item) => sum + item.leads, 0)} leads • {datos.reduce((sum, item) => sum + item.ventas, 0)} ventas
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-lg font-medium">Sin datos para mostrar</p>
          <p className="text-sm">No hay leads ni ventas registradas</p>
        </div>
      )}
    </div>
  );
}
