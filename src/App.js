import logo from './logo.svg';
import './App.css';
import React from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';

function App() {
  return (
    <div className="App">
      <TopBar />
      <MyEditor />
    </div>
  );
}

export default App;
