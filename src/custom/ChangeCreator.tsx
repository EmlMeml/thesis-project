import React, { ChangeEvent, useState, useRef } from 'react';
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

type Message = { sender: string; text: string };

export function generatePrompt(description: string, scopeIndex: number, intensityIndex: number, editorText: string = ''): string {
    const scope = scopeIndex+1;
    const intensity = intensityIndex+1;
    const prompt = `Please apply the following request in the text below: ${description}. Use the following parameters:
    **Scope:** ${scope} out of 3, with 3 = Considerable changes (paragraphs considered), 2 = Moderate changes, 1 = Minor changes (replace words)
    **Intensity:** ${intensity} out of 5, with 5 = Very intense changes, 4 = Intense changes, 3 = Moderate changes, 2 = Mild changes, 1 = Very mild changes
    **Thematic Depth:** High
    **Fidelity:** High
    **Plot Consistency:** High
    Apply these changes to the following Text: ${editorText}`;
    return prompt;
}

export const ChangeCreator = ({ editorText = '' }: { editorText?: string }) => {
    const [intensityIndex, setIntensityIndex] = useState(2); // Default to "Cobblestone"
    const [scopeIndex, setScopeIndex] = useState(1); // Default to "Pond"
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState<Message[]>([]);  

    const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIntensityIndex(Number(e.target.value));
    };

    

    const sendMessage = async () => {
        setMessage(generatePrompt(descriptionRef.current?.value || '', scopeIndex, intensityIndex, editorText));
        console.log("Generated Prompt:", message);
        if(!message.trim()) return;

        const userMessage = { sender: 'You', text: message };
        setChatLog((prev) => [...prev, userMessage]);
        setMessage("");

        const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
        });

        const messageData = await res.json();
        setChatLog((prev) => [...prev, { sender: 'Bot', text: messageData.reply }]);
    };


  return (
    <div
      id="change-creator"
      className="change-creator"
      style={{
        width: 'fit-content',
        maxWidth: '100%',
        minWidth: '280px',
        height: '100%',
        paddingTop: '24px',
        paddingBottom: '16px',
        boxSizing: 'border-box',
        overflowWrap: 'anywhere'
      }}
    >
        <h3>Create your Stone</h3>
        <div id="change-description-container" className="change-elements">
            <p>Describe the changes you want to make:</p>
            <textarea id="change-description" ref={descriptionRef} placeholder="Enter your change description here..." rows={5}></textarea>
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
              <input type="submit" value="Throw Stone" id="change-submit" onClick={() => sendMessage()} />
       </div>
       
    </div>
    );
}

export default ChangeCreator;