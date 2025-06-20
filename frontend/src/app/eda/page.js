'use client'
import { useState,useEffect } from "react";
import Image from "next/image";
import { BrowserRouter as Router, Route,Routes, Link, Switch, BrowserRouter } from "react-router-dom";
import Barplot from "../Test";
import Lineplot from "../Lineplot";
import Pieplot from "../Pieplot";
import Card from "../Card";
import Sidebar from "../Sidebar";
import Pieda from "../Pieda";
import Bareda from "../Bareda";
import Lineplt from "../Lineplt";
import Daraframe from "../Dataframe";
import Stackededa from "../Stackededa";
import Scattr from "../Scatter";
import Heat from "../Heat";

let ip='127.0.0.1'


export default function Eda(){
  return(
    <>
    <Sidebar></Sidebar>
    <div className="maineda">
    <p id="heading">Exploratory Data Analysis</p>
    <div id="row1">
    <Bareda url={`http://${ip}:8000/top_causes`} key1='Cause_of_accident' key2='Count' title='Top 5 Causes of Accidents' col='red' iden='edabar1' id2='edacard'></Bareda>
    <Lineplt title='Time Of Accidents' iden='dayline' url={`http://${ip}:8000/accidents_over_time`} col='red' key1='Hour' key2='Accident_Count'></Lineplt>
    </div>
    <div id='tcon'>
      <Daraframe url={`http://${ip}:8000/getdata`}></Daraframe>
    </div>
    <div id="row2">
      <Pieda url={`http://${ip}:8000/accident_severity_distribution`} key1='Count' key2='Accident_severity' title='Accident Severity Distribution' iden='edapi1'></Pieda>
      <Stackededa url={`http://${ip}:8000/surface_vs_severity`} key1='Road_surface_type' key2='Fatal injury' key3='Serious Injury' key4='Slight Injury' title='Road Surface Type vs. Severity' col='blue' iden='stack'></Stackededa>
    
    
      <Scattr iden='scat' url={`http://${ip}:8000/light_vs_weather`} title='Light Conditions vs Weather Conditions'></Scattr>
      <Bareda iden='stack' url={`http://${ip}:8000/casualty_severity_by_age`} title='Number Of Casualty Per Age Group' key1='Age_band_of_casualty' key2='Count' col='purple' id2='edacard2'></Bareda>
    </div>
    </div>
    </>
  )
}