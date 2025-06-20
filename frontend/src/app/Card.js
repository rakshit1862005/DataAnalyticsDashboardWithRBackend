'use client'
import { useEffect,useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart,ResponsiveContainer,Tooltip } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"];

function Card({url,title,iden,col,key1,key2}){
    const [cardcontent,setcardcontent] = useState(null);
    useEffect(()=>{
        async function getcard() {
            let response = await axios.get(url,{
                headers: {
                    'Accept': 'application/json'
                  }
            });
            setcardcontent(response.data);
        }
        getcard();
    },[])
    if(col=='num'){
    return(
        <div id={iden}>
        <div id='placeholder'>
        {(cardcontent)?(
            <div id='card'>
                {console.log(cardcontent)}
                <h2 id='cardtitle'>{title}</h2>
                <h2 id='cvall'>{cardcontent[0][key1]}</h2>
            </div>
        ):(
            <div>Loading</div>
        )}
        </div>
         </div>

    )
}
else{
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
        <div id='placeholder'>
        {(cardcontent)?(
            <div id='card'>
                {console.log(cardcontent)}
                <h2 id='cardtitle'>{title}</h2>
                <h2 id='cval'>{cardcontent[0][key2]}</h2>
                <div id='cplot' >
                <PieChart height={200} width={200}>
                <Pie data={cardcontent} dataKey={key1} nameKey={key2} cx="25%%" cy="35%" innerRadius={50} outerRadius={70} fill="#82ca9d">
                {cardcontent.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                </PieChart>
                </div>
            </div>
        ):(
            <div>Loading</div>
        )}
        </div>
        </div>
    )
}
}
export default Card;