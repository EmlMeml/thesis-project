import React, { ChangeEvent, useState } from 'react';
import {ReactComponent as SandIcon} from '../img/sand.svg';
import {ReactComponent as CobblestoneIcon} from '../img/cobble.svg';
import {ReactComponent as GravelIcon} from '../img/gravel.svg';
import {ReactComponent as StoneIcon} from '../img/stone.svg';
import {ReactComponent as BolderIcon} from '../img/bolder.svg';



const scopeMapping = ['Puddle', 'Pond', 'Lake'];

const intensityMapping = ['Sand', 'Gravel', 'Stone', 'Cobblestone', 'Rock'];
const intensityIcons = [<SandIcon />, <GravelIcon />, <StoneIcon />, <CobblestoneIcon />, <BolderIcon />];
export const ChangeCreator = () => {
    const [intensityIndex, setIntensityIndex] = useState(2); // Default to "Stone"
    const [scopeIndex, setScopeIndex] = useState(1); // Default to "Pond"

    const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIntensityIndex(Number(e.target.value));
    };

  return (
    <div id="change-creator" className="change-creator">
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
            <output id="change-scope-output">{scopeMapping[scopeIndex]}</output>
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
                <span style={{ display: 'inline-flex', width: '80px', height: '80px', alignItems: 'center', justifyContent: 'center' }}>
                    {intensityIcons[intensityIndex]}
                </span>
                <output id="change-intensity-output">{intensityMapping[intensityIndex]}</output>
            </div>
        </div>
       <div id="change-visualize-container">
       {/* Todo: Add dynamic pic for stone that is "thrown" based on the intensity of the change */}
       </div>
       <input type="submit" value="Throw Stone" id="change-submit" />
    </div>
    );
}

export default ChangeCreator;