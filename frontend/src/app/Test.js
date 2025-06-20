'use client'
import React,{useState,useEffect} from 'react';
import axios, { Axios } from 'axios';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis,Tooltip } from 'recharts';

function Barplot({url,key1,key2,iden,col,title}){
   const [dframe,setdframe]=useState(null);
   useEffect(()=>{
        async function fetchdata() {
        let response = await axios.get(url);
        let data = await response.data;
        setdframe(data);
        }
        fetchdata();
   },[]);
    return(
        <div id={iden}>
            {(dframe)?(
                <div id="graph">
                    <ResponsiveContainer
                    height="80%"
                    width="90%"
                    >
                    <BarChart
                    data={dframe}

                    fill={col}
                    >
                    <Tooltip></Tooltip>
                    <XAxis dataKey={key1} interval={0} tick={{fontSize:8}}></XAxis>
                    <YAxis dataKey={key2} tickCount={20}></YAxis>
                    <Bar dataKey={key2} animationDuration={2500} radius={[5,5,0,0]}></Bar>
                    
                    </BarChart>
                    </ResponsiveContainer>
                    <p>{title}</p>
                </div>

            ):(
                <div>Loading</div>
            )
            }
        </div>
    )
}
export default Barplot;