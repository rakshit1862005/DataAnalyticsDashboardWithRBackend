'use client'
import React,{useState,useEffect} from 'react';
import axios, { Axios } from 'axios';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis,Tooltip,angle,textAnchor } from 'recharts';

function Bareda({url,key1,key2,iden,col,title,id2}){
   const [data,setdata]=useState(null);
   useEffect(()=>{
        async function fetchdata() {
        let response = await axios.get(url);
        setdata(response.data);
        }
        fetchdata();
   },[]);
    return(
        <div id={iden}>
        <div id={id2}>
            {(data)?(
                <div id="edaplot">
                    <ResponsiveContainer
                    height="87.5%"
                    width="96%"
                    >
                    <BarChart
                    data={data}

                    fill={col}
                    >
                    <Tooltip></Tooltip>
                    <XAxis dataKey={key1} interval={0} tick={{fontSize:10}} textAnchor='middle'></XAxis>
                    <YAxis></YAxis>
                    <Bar dataKey={key2} animationDuration={2500} radius={[5,5,0,0]}></Bar>
                    </BarChart>
                    </ResponsiveContainer>
                    <div id='edatitle'>{title}</div>
                </div>

            ):(
                <div>Loading</div>
            )
            }
        </div>
        </div>
    )
}
export default Bareda;