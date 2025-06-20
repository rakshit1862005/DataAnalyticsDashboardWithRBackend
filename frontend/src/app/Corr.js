'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CorrelationCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/correlation_vehicles_casualties') // 🔁 Replace with your actual endpoint
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch correlation data.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="card-container p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-4">
      <div className="card">
        <h3 className="text-xl font-bold mb-2">Correlation Analysis</h3>
        <div className="card-body space-y-2">
          <p className="font-semibold">Number Of Vehicles Involved And Number Of Casualties</p>
          <p><strong>Method:</strong> {data.method[0]}</p>
          <p><strong>Correlation:</strong> {data.correlation[0].toFixed(4)}</p>
          <p><strong>Confidence Interval:</strong> {data.conf_int[0]} - {data.conf_int[1]}</p>
          <p><strong>p-value:</strong> {data.p_value[0].toExponential(2)}</p>
          <p><strong>t-statistic:</strong> {data.t_statistic[0]}</p>
          <p><strong>Degrees of Freedom:</strong> {data.df[0]}</p>
        </div>
      </div>
    </div>
  );
};

export default CorrelationCard;
