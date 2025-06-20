'use client'
import { useEffect,useState } from "react";
import { LineChart,Tooltip,Legend,Line, XAxis, YAxis ,ResponsiveContainer,CartesianGrid} from "recharts";
import axios from "axios";

function Lineplt({url,key1,key2,iden,col,title}){
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
        <div id='edacard'>
            {(data)?(
                <div id="edaplot">
                    <ResponsiveContainer
                    height="87.5%"
                    width="96%"
                    >
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                        <XAxis dataKey={key1}></XAxis>
                        <YAxis></YAxis>
                        <Line stroke={col} dataKey={key2} animationDuration={2500}></Line>
                        <Tooltip></Tooltip>
                    </LineChart>
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
export default Lineplt