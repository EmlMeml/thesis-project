import React, { ChangeEvent, useState } from 'react';
import {ReactComponent as StoneIcon} from '../img/stone.svg';
import {ReactComponent as PuddleIcon} from '../img/puddle.svg';
import {ReactComponent as PondIcon} from '../img/pond.svg';
import {ReactComponent as LakeIcon} from '../img/lake.svg';

const scopeMapping = ['Puddle', 'Pond', 'Lake'];
const scopeIcons = [PuddleIcon, PondIcon, LakeIcon];

const intensityMapping = ['Drop Stone', 'Half-Hearted Throw', 'Medium Strength Throw', 'Full Arm-leg Throw'];
export const ChangeCreator = () => {
    const [intensityIndex, setIntensityIndex] = useState(2); // Default to "Stone"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <output id="change-scope-output">{scopeMapping[scopeIndex]}</output>
                <br />
                <span style={{ display: 'inline-flex', width: 'auto', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                    {scopeIcons[scopeIndex] ? React.createElement(scopeIcons[scopeIndex]) : null}
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
                <output id="change-intensity-output">{intensityMapping[intensityIndex]}</output>
            </div>
        </div>
       <div id="change-visualize-container">
       <StoneIcon style={{ width: '100px', height: '100px' }} />
       <input type="submit" value="Throw Stone" id="change-submit" />
       </div>
       
    </div>
    );
}

export default ChangeCreator;