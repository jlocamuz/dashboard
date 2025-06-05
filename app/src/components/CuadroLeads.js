import React from 'react';

export default function CuadroLeads({ leads, title = "📊 Resumen de Leads" }) {
  // Calcular estadísticas
  const totalLeads = leads.length;
  const leadsNuevos = leads.filter(lead => lead.estado === 'NUEVO').length;
  const leadsVendidos = leads.filter(lead => lead.estado === 'VENDIDO').length;
  const leadsRechazados = leads.filter(lead => lead.estado === 'RECHAZADO').length;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 w-16">ID</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 w-24">Vendedor</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 w-28">Estado</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 w-32">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 10).map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-900 font-medium">#{lead.id}</td>
                <td className="py-3 px-4 text-gray-700 text-center">{lead.user_id}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.estado === 'NUEVO' ? 'bg-blue-100 text-blue-700' :
                    lead.estado === 'VENDIDO' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {lead.estado}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-right">{lead.fecha_creacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length > 10 && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            Mostrando 10 de {totalLeads} leads
          </p>
        </div>
      )}

      {leads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay leads para mostrar</p>
        </div>
      )}
    </div>
  );
}