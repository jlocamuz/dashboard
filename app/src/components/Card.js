import React, { useState } from 'react';

export default function Card({title, value }) {

  return (
    <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
  </div>
  );
}