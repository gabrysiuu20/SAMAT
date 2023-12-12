import { Screen } from '../vncLib'
import './App.css';
import React, { useEffect, useState, useRef } from "react";

function App() {
  const [vncUrl, setVncUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const vncScreenRef = useRef(null)

  const isValid = vncUrl => {
    if (!vncUrl.startsWith("ws://") && !vncUrl.startsWith("wss://")) {
      return false
    }

    return true
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          SAMAT version 1.0
        </p>
      </header>
      <div style={{ margin: '1rem' }}>
        {
          isValid(vncUrl)
            ?
            (
              <Screen
                url={vncUrl}
                scaleViewport
                background="#000000"
                style={{
                  width: '75vw',
                  height: '75vh',
                }}
                debug
                ref={vncScreenRef}
              />
            )
            : <div>VNC URL not provided.</div>
        }
      </div>
    </div>
  );
}

export default App;
