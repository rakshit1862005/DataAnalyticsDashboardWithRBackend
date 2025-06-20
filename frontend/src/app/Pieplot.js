'use client'
import { useEffect,useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart,ResponsiveContainer,Tooltip,Legend } from "recharts";
import { Colors } from "chart.js";

const COLORS = ["#ff8042", "#d0ed57","#82ca9d", "#ffc658", "#8884d8", "#8dd1e1", "#a4de6c"];


function Pieplot({url,key1,key2,iden,title}){
    const [dframe,setdframe]=useState(null);
    useEffect(()=>{
         async function fetchdata(params) {
         let response = await axios.get(url);
         let data = await response.data;
         setdframe(data);
         }
         fetchdata();
    },[]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="tooltip">
                    <p><strong>{data[key1]}</strong> : {data[key2]}</p>
                </div>
            );
        }
        return null;
    };

    return(
        <div id={iden}>
            {dframe?(
                <div id="pigraph">
                    {console.log(dframe)}
                    <ResponsiveContainer height="80%" width="90%">
                        <PieChart>
                            <Pie dataKey={key2} data={dframe} nameKey={key1}  height="80%" width="90%" fill='blue'>
                                {dframe.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                                        
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend layout="vertical" align="right" />
                            
                        </PieChart>
                    </ResponsiveContainer>
                    <p>{title}</p>
                </div>
            ):(
                <div>Loading</div>
            )}
        </div>
    )
}
export default Pieplot;