'use client'
import { useEffect,useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart,ResponsiveContainer,Tooltip,Legend } from "recharts";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"];

function Pieda({url,key1,key2,title,iden}){
    const [data,setdata] = useState(null);
    useEffect(()=>{
        async function getdata() {
            let response = await axios.get(url,{
                headers: {
                    'Accept': 'application/json'
                  }
            });
            setdata(response.data);
        }
        getdata();
    },[])
const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="tooltip">
                    <p><strong>{data[key2]}</strong> : {data[key1]}</p>
                </div>
            );
        }
        return null;
    };
    return(
        <div id={iden}>
        <div id='edacard2'>
        {(data)?(
            <div >
                <div id='edaplot' >
                <PieChart height={350} width={500}>
                <Pie data={data} dataKey={key1} nameKey={key2} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#82ca9d">
                {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" align="right" />
                </PieChart>
                <div id='edatitle'>{title}</div>
                </div>
            </div>
        ):(
            <div>Loading</div>
        )}
        </div>
        </div>
    )
}

export default Pieda;