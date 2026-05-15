import './App.css';
import './loading-text.css';
import './text-roller.css'
import './wobble.css';
import './letter-spacing.css';
import React from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';

function App() {
  return (
    <div className="App">
      <TopBar />
      <div id="editor-container">
      <MyEditor />
      </div>

      <div class="loading-animation">
        <p>Loading...</p>
      </div>

      <div id="text-roller">
        <h1>Wir sagen... </h1>
        <div class="string">
          <h1>Willkommen</h1>
          <h1>Bienvenue</h1>
          <h1>Welcome</h1>
          <h1>Benvenuto</h1>
        </div>
      </div>
      

      <div class="wobble">
        Ebrio de trementina y largos besos,
        <span>estival, el velero de las rosas dirijo,</span>
        torcido hacia la muerte del delgado día,
        Pálido y <span>amarrado a mi agua</span> devorante
        cimentado en el sólido frenesí marino.
        <span>cruzo en el agrio olor del clima descubierto,</span>
      </div>

      <p class="letter-spacing a01">Beispiel</p>
      <p class="letter-spacing a02">Beispiel</p>
      <p class="letter-spacing a03">Beispiel</p>
      <p class="letter-spacing a04">Beispiel</p>

      


    </div>
    
  );
}

export default App;
