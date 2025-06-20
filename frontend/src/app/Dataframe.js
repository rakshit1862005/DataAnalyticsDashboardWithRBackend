import axios from "axios";
import { useEffect,useState } from "react";
import { CompactTable } from '@table-library/react-table-library/compact';

function Table({ data }) {
    if (!data || data.length === 0) {
      return <p>No data to display.</p>;
    }
    const headers = Object.keys(data[0]);
  
    return (
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(item).map((value, cellIndex) => (
                <td key={cellIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

function Dataframe({url}){
    const [data,setdata]=useState(null);
    useEffect(()=>{
        async function getdata() {
            let response = await axios.get(url);
            let d = response.data;
            setdata(d);
        }
        getdata();
    },[])

    return(
        <div>
            {data?(
                <div id='table-container'>
                <Table data={data}/>
                </div>
            ):(
                <div>Nodata</div>
            )
        }
        </div>
    )
}
export default Dataframe;