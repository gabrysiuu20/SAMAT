import {Title, Wrapper, OptButton, StrButton} from './StyledComp.js'
import './CssForVms.css'
import { Screen } from '../vncLib'
import sleepyAndroid from '../assets/sleepyAndroid.png'
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useBeforeUnload, isRouteErrorResponse } from "react-router-dom";


export default function FirstVm({isPending}) {
    const [vncUrl, setVncUrl] = useState("")
    const [network, setNetwork] = useState(true)
    const vncScreenRef = useRef(null)

    const navigate = useNavigate();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';

    document.body.appendChild(fileInput);

    // LIMIT API - 4 ZAPYTANIA/MIN, 500 ZAPYTAŃ/DZIEŃ
    function sendFile() {
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append('file', file);
    
      fetch('https://www.virustotal.com/api/v3/files', {
        method: 'POST',
        body: formData,
        headers: {
        accept: 'application/json', 
        'x-apikey': '977f090b832f3539b859ca70241c08e8ffe386ea45c399c15a0f0a33f6a844af'}
      })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded successfully:', data);
        console.log('ID:', data.data.id);
        analiseID(data.data.id)
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    }

    function analiseID(id) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-apikey': '977f090b832f3539b859ca70241c08e8ffe386ea45c399c15a0f0a33f6a844af'
        }
      };
      
      fetch('https://www.virustotal.com/api/v3/analyses/' + id, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    }

    
    const isValid = vncUrl => {
      if (!vncUrl.startsWith("ws://") && !vncUrl.startsWith("wss://")) {
          return false
      }

      return true
    }   

    useBeforeUnload(
      React.useCallback(() => {
          localStorage.stuff = localStorage.setItem('vnc', JSON.stringify(vncUrl));
      }, [vncUrl])
    );

    useEffect(() => {
      const vncUrl = JSON.parse(localStorage.getItem('vnc'));
      if (vncUrl) {
        setVncUrl(vncUrl);
      }
    }, [vncUrl]);

    return (  
      <div className="FirstVm">
        <Wrapper style={{
          opacity: isPending ? 0.7 : 1 
        }}>
          <Title>SAMAT version 1.1</Title>
        </Wrapper>
        <OptButton onClick={() => navigate("/")}>
          Home Screen
        </OptButton>
        <OptButton onClick={() => setNetwork(false)}>
          Offline mode
        </OptButton>
        <OptButton onClick={() => sendFile()}>
          VirusTotal Check
        </OptButton>
        
        <div className="startButtonPosition">
          {
            isValid(vncUrl) 
              ? 
              ( 
                <StrButton onClick={() => localStorage.removeItem('vnc') & navigate("/")}>STOP</StrButton>
              ) :
              (
                <StrButton onClick={() => setVncUrl(atob('d3M6Ly8xOTIuMTY4LjE5OS4xNjA6NzAwMA=='))}>START</StrButton>
              ) 
          }          
        </div>
        
        <div className="App-header">
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
              : <img src={sleepyAndroid} alt="android"/>
          }
        </div>
      
      </div>
    );
};

