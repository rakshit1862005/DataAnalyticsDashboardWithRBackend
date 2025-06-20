import Barplot from "../Test";
import Lineplot from "../Lineplot";
import Pieplot from "../Pieplot";
import Card from "../Card";
import Sidebar from "../Sidebar";
import Pieda from "../Pieda";
import Bareda from "../Bareda";
import Lineplt from "../Lineplt";

 let ip='127.0.0.1'


export default function Home() {
  return (
    <>
    <Sidebar></Sidebar>
    <div id='sumplots'>
    <Barplot url={`http://${ip}:8000/accidents_by_day`} key1='Day_of_week' key2='Accidents' iden='plot1' col='blue' title='Accidents By Day'></Barplot>
    <Barplot url={`http://${ip}:8000/casualty_severity_by_age`} key1='Age_band_of_casualty' key2='Count' iden='plot2' col='red' title='Number Of Casualty Per Age Group'></Barplot>
    <Pieplot url={`http://${ip}:8000/driver_gender_distribution`} key1='Sex_of_driver' key2='Count' iden='pieplot'title='Accident Distribution By Gender'></Pieplot>
    </div>
    <p id="heading">Data Summary</p>
    <div className="heads">
    <Card title='Total Accidents' iden='total' url={`http://${ip}:8000/total_accidents`} col='num' key1='total_accidents'></Card>
    <Card title='Most Common Cause' iden='cause' url={`http://${ip}:8000/most_common_cause`} col='graph' key1='count' key2='Cause_of_accident'></Card>
    <Card title='Most Wrecked Vehichle' iden='vehichle' url={`http://${ip}:8000/most_wrecked_vehicle`} col='graph' key1='count' key2='Type_of_vehicle'></Card>
    <Card title='Mostly People Of Ages' iden='ageband' url={`http://${ip}:8000/most_affected_ageband`} col='graph' key1='count' key2='Age_band_of_casualty'></Card>
    <Card title='Day With Most Accidents' iden='accidentday' url={`http://${ip}:8000/most_accidents_day`} col='graph' key1='count' key2='Day_of_week'></Card>
    </div>
    </>
  );
}
