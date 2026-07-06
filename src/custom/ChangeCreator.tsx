import React, { ChangeEvent, useState } from 'react';

const intensityMapping = ['Sand', 'Gravel', 'Stone', 'Cobblestone', 'Rock'];
export const ChangeCreator = () => {
    const [intensityIndex, setIntensityIndex] = useState(2); // Default to "Stone"

    const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIntensityIndex(Number(e.target.value));
    };

  return (
    <div id="change-creator" className="change-creator">
        <h3>Create your Change</h3>
        <div id="change-description-container" className="change-elements">
            <p>Describe the changes you want to make:</p>
            <textarea id="change-description" placeholder="Enter your change description here..." rows={5}></textarea>
        </div>
        <div id="change-scope-container" className="change-elements">
            <p>Describe the scope of the changes:</p>
            <input type="radio" id="change-scope-word" name="change-scope" value="word" />
            <label htmlFor="change-scope-word">Puddle</label>
            <input type="radio" id="change-scope-sentence" name="change-scope" value="sentence" />
            <label htmlFor="change-scope-sentence">Pond</label>
            <input type="radio" id="change-scope-paragraph" name="change-scope" value="paragraph" />
            <label htmlFor="change-scope-paragraph">Lake</label>
       </div>
        <div id="change-intensity-container" className="change-elements">
            <p>Describe the intensity of the changes:</p>
            <input 
                type="range" 
                id="change-intensity"  
                min={0} 
                max={intensityMapping.length - 1} 
                step={1}
                value={intensityIndex}
                onChange={(e) => setIntensityIndex(Number(e.target.value))}
            />
            <output id="change-intensity-output">{intensityMapping[intensityIndex]}</output>
        </div>
       <div id="change-visualize-container">
       {/* Todo: Add dynamic pic for stone that is "thrown" based on the intensity of the change */}
       </div>
    </div>
    );
}

export default ChangeCreator;