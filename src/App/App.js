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

  const Spacer = () => <div style={{ width: '2rem', display: 'inline-block' }} />;

  return (
    <div className="App">
      <div style={{ margin: '1rem' }}>
        <label htmlFor="url">URL for VNC Stream</label>
        <Spacer />

        <input type="text" onChange={({ target: { value } }) => {
          setInputUrl(value);
        }} name="url" placeholder="wss://your-vnc-url" />

        <Spacer />
        <button onClick={() => setVncUrl(inputUrl)}>Go!</button>
      </div>

      <div style={{ opacity: 0.5, margin: '1rem' }}>
        Since the site is loaded over HTTPS, only `wss://` URLs (SSL encrypted websockets URLs) are supported.
        <br />
        To test a `ws://` URL, clone the application and run it on http://localhost:3000, or <a href="https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en#task_5448763B8DC941FD80F84041AEF0A14D">enable Mixed Content on your browser</a>.
      </div>
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
