import React, { ChangeEvent, useState } from 'react';
import StoneIcon from '../img/stone.svg';
import BoulderIcon from '../img/bolder.svg';
import CobblestoneIcon from '../img/cobble.svg';
import PebbleIcon from '../img/gravel.svg';
import SandIcon from '../img/sand.svg';
import PuddleIcon from '../img/puddle.svg';
import PondIcon from '../img/pond.svg';
import LakeIcon from '../img/lake.svg';

const scopeMapping = ['Puddle', 'Pond', 'Lake'];
const scopeIcons = [PuddleIcon, PondIcon, LakeIcon];

const intensityMapping = ['Sand', 'Pebble','Cobblestone', 'Stone' , 'Boulder'];
const intensityIcons = [SandIcon, PebbleIcon, CobblestoneIcon, StoneIcon, BoulderIcon];

export const ChangeCreator = () => {
    const [intensityIndex, setIntensityIndex] = useState(2); // Default to "Cobblestone"
    const [scopeIndex, setScopeIndex] = useState(1); // Default to "Pond"

    const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIntensityIndex(Number(e.target.value));
    };

  return (
    <div
      id="change-creator"
      className="change-creator"
      style={{
        width: 'fit-content',
        maxWidth: '100%',
        minWidth: '280px',
        height: 'auto',
        paddingTop: '24px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        overflowWrap: 'anywhere'
      }}
    >
        <h3>Create your Stone</h3>
        <div id="change-description-container" className="change-elements">
            <p>Describe the changes you want to make:</p>
            <textarea id="change-description" placeholder="Enter your change description here..." rows={5}></textarea>
        </div>
        <div id="change-scope-container" className="change-elements">
            <p>Choose the scope of the changes:</p>
            <input 
                type="range" 
                id="change-scope-slider" 
                min={0} 
                max={scopeMapping.length - 1} 
                step={1}
                value={scopeIndex}
                onChange={(e) => setScopeIndex(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ display: 'inline-flex', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                    {scopeIcons[scopeIndex] ? <img src={scopeIcons[scopeIndex]} alt={scopeMapping[scopeIndex]} style={{ width: 80, height: 80 }} /> : null}
                </span>
            </div>
        </div>
        <div id="change-intensity-container" className="change-elements"> 
            <p>Choose the intensity of the changes:</p>
            <input 
                type="range" 
                id="change-intensity"  
                min={0} 
                max={intensityMapping.length - 1} 
                step={1}
                value={intensityIndex}
                onChange={handleIntensityChange}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <output id="change-intensity-output">
                    {/* {intensityMapping[intensityIndex]} */}
                </output>
                <br />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span style={{ display: 'inline-flex', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                {intensityIcons[intensityIndex] ? <img src={intensityIcons[intensityIndex]} alt={intensityMapping[intensityIndex]} style={{ width: 80, height: 80 }} /> : null}
            </span>
            </div>
            <br />
            <input type="submit" value="Throw Stone" id="change-submit" />
       </div>
       
    </div>
    );
}

export default ChangeCreator;