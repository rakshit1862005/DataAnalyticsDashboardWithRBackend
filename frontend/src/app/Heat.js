'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Heat({ url, iden, title }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(url);
      setData(response.data);
    }
    fetchData();
  }, [url]); // Make sure to refetch data if the URL changes

  return (
    <div id={iden}>
      <div id="edacard2">
        {data ? (
          <div id="edaplot">
            <ResponsiveContainer width="96%" height={350}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Age_band_of_casualty" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div id="edatitle">{title}</div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Heat;
