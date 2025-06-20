'use client'
import { useEffect,useState } from "react";
import { LineChart,Tooltip } from "recharts";

function Lineplot({url,key1,key2,iden}){
    const [dframe,setdframe]=useState(null);
    useEffect(()=>{
         async function fetchdata(params) {
         let response = await axios.get(url);
         let data = await response.data;
         setdframe(data);
         }
         fetchdata();
    },[]);
    return(
        <div id={iden}>
            {dframe?(
                <div>
                    
                </div>
            ):(
                <div>Loading</div>
            )}
        </div>
    )
}
export default Lineplot;