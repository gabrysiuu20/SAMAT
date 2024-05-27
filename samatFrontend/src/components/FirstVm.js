import {Title, Wrapper, OptButton, StrButton} from './StyledComp.js'
import './CssForVms.css'
import { Screen } from '../vncLib'
import sleepyAndroid from '../assets/sleepyAndroid.png'
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";


export default function FirstVm({isPending}) {
    const [vncUrl, setVncUrl] = useState("")
    const [network, setNetwork] = useState(true)
    const vncScreenRef = useRef(null)

    const navigate = useNavigate();
    
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

