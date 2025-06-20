'use client'
import TTestCasualtiesGender from "../Tgender";
import CorrelationCard from "../Corr";
import ANOVAcasualtiesRoadCondition from "../Tests";
import { useEffect,useState } from "react";
import Sidebar from "../Sidebar";

function SampleSizeSlider({ sampleSize, setSampleSize }) {
  return (
    <div className="slider-container">
      <label className="slider-label">Sample Size: {sampleSize}</label>
      <input
        type="range"
        min="66"
        max="2000"
        step="10"
        value={sampleSize}
        onChange={(e) => setSampleSize(parseInt(e.target.value))}
      />
    </div>
  );
}
function AlphaSlider({ alpha, setAlpha }) {
  return (
    <div className="slider-container">
      <label className="slider-label">Alpha: {alpha}</label>
      <input
        type="range"
        min="0.01"
        max="0.3"
        step="0.01"
        value={alpha}
        onChange={(e) => setAlpha(parseFloat(e.target.value))}
      />
    </div>
  );
}
 let ip='127.0.0.1'

export default function Tests(){
  const [alpha, setAlpha] = useState(0.05);
  const [sampleSize, setSampleSize] = useState(67);
  return(
    <>
    <Sidebar></Sidebar>
    <p id="heading">Statistical Tests</p>
    <div id='filter'>
    <AlphaSlider alpha={alpha} setAlpha={setAlpha} />
    <SampleSizeSlider sampleSize={sampleSize} setSampleSize={setSampleSize} />
    </div>
    <div id='roow2'>
    <TTestCasualtiesGender id="ttest" alph={alpha} sampleSiz={sampleSize}></TTestCasualtiesGender>
    
    </div>
    <div id='roow3'>
    <CorrelationCard id="corr"></CorrelationCard>
    <ANOVAcasualtiesRoadCondition id="anova" alph={alpha} sampleSiz={sampleSize}></ANOVAcasualtiesRoadCondition>
    </div>
    </>
  )
}
