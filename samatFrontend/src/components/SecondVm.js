import {Title, Wrapper, OptButton, StrButton} from './StyledComp.js'
import { Screen } from '../vncLib'
import React, { useState, useRef, useEffect } from "react";
import './CssForVms.css'
import sleepyAndroid from '../assets/sleepyAndroid.png'
import { useNavigate, useBeforeUnload } from "react-router-dom";


export default function SecondVm({isPending}) {
    const [secondVncUrl, setSecondVncUrl] = useState("")
    const vncScreenRef = useRef(null)
    const [network, setNetwork] = useState(true)


    const navigate = useNavigate();

    const isValid = secondVncUrl => {
        if (!secondVncUrl.startsWith("ws://") && !secondVncUrl.startsWith("wss://")) {
            return false
        }

        return true
    }


    useBeforeUnload(
      React.useCallback(() => {
          localStorage.stuff = localStorage.setItem('secVnc', JSON.stringify(secondVncUrl));
      }, [secondVncUrl])
    );

    useEffect(() => {
      const secondVncUrl = JSON.parse(localStorage.getItem('secVnc'));
      if (secondVncUrl) {
        setSecondVncUrl(secondVncUrl);
      }
    }, [secondVncUrl]);

    return (  
      <div className="SecondVm">
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
            isValid(secondVncUrl) 
              ? 
              ( 
                <StrButton onClick={() => localStorage.removeItem('secVnc') & navigate('/')}>STOP</StrButton>
              ) :
              (
                <StrButton onClick={() => setSecondVncUrl(atob('d3M6Ly8xOTIuMTY4LjE5OS4xNjA6NzAwMQ=='))}>START</StrButton>
              ) 
          }  
        </div>   

        
        <div className="App-header">
          {
            isValid(secondVncUrl)
              ?
              (
                <Screen
                  url={secondVncUrl}
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


