'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

function Stackededa({ url, key1, key2, key3, key4, iden, col, title }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchdata() {
      let response = await axios.get(url);
      setData(response.data);
    }
    fetchdata();
  }, []);

  return (
    <div id={iden}>
      <div id='edacard2'>
        {data ? (
          <div id="edaplot">
            <ResponsiveContainer height="87.5%" width="96%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <XAxis
                  dataKey={key1}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Bar dataKey={key2} animationDuration={2500} radius={[4, 4, 0, 0]} fill='blue' />
                <Bar dataKey={key3} animationDuration={2500} radius={[4, 4, 0, 0]} fill='green'/>
                <Bar dataKey={key4} animationDuration={2500} radius={[4, 4, 0, 0]} fill='orange' />
              </BarChart>
            </ResponsiveContainer>
            <div id='edatitle'>{title}</div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
}

export default Stackededa;
