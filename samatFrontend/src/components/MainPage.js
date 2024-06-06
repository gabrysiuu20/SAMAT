import React, { useState, useEffect, useRef } from "react";
import { Screen } from '../vncLib'
import { useNavigate, useBeforeUnload, isRouteErrorResponse } from "react-router-dom";
import './CssForVms.css'
import {ButtonsContainer, EmptyScreenVM, InfoBoxLong, InfoBoxLongUpper, InfoBoxLongBottom, InfoBoxShort, 
  InfoBoxShortUpper, InfoBoxShortBottom, InfoBoxShortBottomScrolled, InfoBoxShortBottomPermissions, InfoBoxLongBottomSection, 
  ButtonWithIcon, ButtonWithIcon2} from './StyledComp.js'

import uploadIcon from '../assets/upload_file.svg'
import downloadIcon from '../assets/file_download.svg'
import displayIcon from '../assets/smart_display.svg'
import infoIcon from '../assets/info.svg'
import folderIcon from '../assets/folder.svg'
import analyticsIcon from '../assets/analytics.svg'
import bugIcon from '../assets/bug_report.svg'
import androidIcon from '../assets/android.svg'
import proxyIcon from '../assets/compare_arrows.svg'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';


export default function MainPage({ isPending }) {
    const [vncUrl, setVncUrl] = useState("")
    const [network, setNetwork] = useState(true)
    const [uploadedFile, setUploadedFile] = useState("")
    const vncScreenRef = useRef(null)

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

    const runVnc = () => {
        setVncUrl(atob('d3M6Ly8xOTIuMTY4LjE5OS4xNjA6NzAwMA=='))
        console.log("first vnc set")
    }

    const runVnc2 = () => {
        setVncUrl(atob('d3M6Ly8xOTIuMTY4LjE5OS4xNjA6NzAwMQ=='))
        console.log("second vnc set")
    }

    const handleSubmitFile = (e) => {
      setUploadedFile(e.target.files);
    }

    const showPermissions = async () => {
      if (uploadedFile[0] == "") return;

      
    }

    async function sendFile() {

      const file = uploadedFile[0]

      //VIRUSTOTAL UPLOAD

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
        console.log('VirusTotal uploaded successfully:', data);
        analiseID(data.data.id)
      })
      .catch(error => {
        console.error('VirusTotal error uploading:', error);
      });


      //SAMAT UPLOAD

      // const formData2 = new FormData();
      // formData2.append('formFile', file);

      // fetch('http://192.168.199.160/VirtualMachine/Upload', {
      //   method: 'POST',
      //   body: formData2
      // })
      // .then(response => response)
      // .then(data => {
      //   console.log('Upload successfull:', data);
      //   analiseSAMAT()
      // })
      // .catch(error => {
      //   console.error('Upload error:', error);
      // });

      //END
    }

    //VIRUSTOTAL ANALYSIS
    const [vtMalicious, setvtMalicious] = useState([])
    const [vtHarmless, setvtHarmless] = useState([])
    const [vtUndetected, setvtUndetected] = useState([])
    const [vtSuspicious, setvtSuspicious] = useState([])
    const [vtMalwareBytes, setvtMalwareBytes] = useState([])
    const [vtClamAV, setvtClamAV] = useState([])
    const [vtAVG, setvtAVG] = useState([])

    async function analiseID (id) {
      await fetch('https://www.virustotal.com/api/v3/analyses/' + id, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-apikey': '977f090b832f3539b859ca70241c08e8ffe386ea45c399c15a0f0a33f6a844af'
        }
        })
        .then(response => response.json())
        .then(data => { 
          console.log(data.data.attributes.stats);
          console.log(data.data);
          setvtMalicious(data.data.attributes.stats.malicious);
          setvtHarmless(data.data.attributes.stats.harmless);
          setvtUndetected(data.data.attributes.stats.undetected);
          setvtSuspicious(data.data.attributes.stats.suspicious);
          setvtMalwareBytes(data.data.attributes.results.Malwarebytes.result);
          setvtClamAV(data.data.attributes.results.ClamAV.result);
          setvtAVG(data.data.attributes.results.AVG.result);
        })
        .catch(err => console.error(err));
        };

    //SAMAT ANALYSIS

    async function analiseSAMAT () {
            //SAMAT SHOWFILESYSTEM
            await fetch('http://192.168.199.160/VirtualMachine/ShowFileSystem', {
              method: 'GET',
            })
            .then(response => response)
            .then(data => {
              console.log('ShowFileSystem successfull:', data);
            })
            .catch(error => {
              console.error('ShowFileSystem error:', error);
            });
      
            //SAMAT SHOWPROXY
            await fetch('http://192.168.199.160/VirtualMachine/ShowProxy', {
              method: 'GET',
            })
            .then(response => {
              console.log(response)
            })
            .then(data => {
              console.log('ShowProxy successfull:', data);
            })
            .catch(error => {
              console.error('ShowProxy error:', error);
            });
    }

    return (
      <Container fluid="xl" className="main-container">

        <Row className="vm-container">
          <Col> 
          {isValid(vncUrl) ?
              (
                <Screen
                  url={vncUrl}
                  scaleViewport
                  background="#212529"
                  style={{
                    width: '900px',
                    height: '500px',
                  }}
                  debug
                  ref={vncScreenRef}
                />
              ) 
              : <EmptyScreenVM/>}
          </Col>
          <Col> 
              <ButtonsContainer>
                <Button variant="info" onClick={() => runVnc()}>
                    <ButtonWithIcon>
                    <Image src={displayIcon} width={24} height={24}/>
                    <b>MASZYNA WIRTUALNA 1</b>
                    </ButtonWithIcon>
                </Button>
                <Button variant="info" onClick={() => runVnc2()}>
                <ButtonWithIcon>
                    <Image src={displayIcon} width={24} height={24}/>
                    <b>MASZYNA WIRTUALNA 2</b>
                    </ButtonWithIcon>
                </Button>
                <>
                  <Form.Group controlId="formFile">
                    <Form.Control type="file" onChange={handleSubmitFile}/>
                  </Form.Group>
                  <Button variant="primary" onClick={() => sendFile()}> 
                    <ButtonWithIcon2>
                    <Image src={uploadIcon} width={24} height={24}/>
                    <b>ANALIZUJ .APK</b>
                    </ButtonWithIcon2>
                  </Button>
                </>
                <Button variant="secondary">
                    <ButtonWithIcon2>
                    <Image src={downloadIcon} width={24} height={24}/>
                    <b>POBIERZ .PCAP</b>
                    </ButtonWithIcon2>
                </Button>
              </ButtonsContainer>
          </Col>
        </Row>

        <Row>
          <Col>
              <InfoBoxLong>
                <InfoBoxLongUpper><h4><Badge bg="primary"> <Image src={infoIcon} width={24} height={24}/> INFORMACJE O APLIKACJI</Badge></h4></InfoBoxLongUpper>
                <InfoBoxLongBottom>
                  <Row>
                    <Col>
                      <InfoBoxLongBottomSection>
                        <div><Badge bg="dark">Nazwa pliku</Badge> Aplikacja XD</div>
                        <div><Badge bg="dark">Rozmiar pliku</Badge> 10.53MB</div>
                        <div><Badge bg="dark">MD5</Badge> ba64bbc1f05ce490692cde8bc60bf4b7</div>
                        <div><Badge bg="dark">SHA1</Badge> 9f1f4ebae91d5c8271630082911b8ec09e430ffd</div>
                        <div><Badge bg="dark">SHA256</Badge> 43c6aeeae007bb0c33210fddceb0e95f88b45f5039383c4da911d61f9cb732b7</div>
                        <div><Badge bg="dark">Developer</Badge> SAMAT Interactive</div>
                        <div><Badge bg="dark">Data wydania</Badge> 22/02/2024</div>
                      </InfoBoxLongBottomSection>
                    </Col>
                    <Col>
                      <InfoBoxLongBottomSection>
                        <h5><Badge bg="warning" text="dark">Wskaźnik bezpieczeństwa</Badge> 50/100</h5>
                        <h5><Badge bg="success" text="light">Trackers detection</Badge> 0/432 </h5>
                        <div><Badge bg="dark">Nazwa pakietu</Badge> com.afwsamples.testdpc</div>
                        <div><Badge bg="dark">Target SDK</Badge> 34</div>
                        <div><Badge bg="dark">Min SDK</Badge> 21</div>
                        <div><Badge bg="dark">Dodatkowe</Badge> info</div>
                      </InfoBoxLongBottomSection>
                    </Col>
                  </Row>
                </InfoBoxLongBottom>
              </InfoBoxLong>
            </Col>
        </Row>

        <Row>
          <Col>
              <InfoBoxShort>
                <InfoBoxShortUpper><h4><Badge bg="primary"> <Image src={proxyIcon} width={24} height={24}/> PROXY</Badge></h4></InfoBoxShortUpper>
                <InfoBoxShortBottomScrolled>
                   Proxy tekst
                </InfoBoxShortBottomScrolled>
              </InfoBoxShort>
          </Col>
          <Col>
                <InfoBoxShort>
                <InfoBoxShortUpper><h4><Badge bg="primary"><Image src={folderIcon} width={24} height={24}/> SYSTEM PLIKÓW</Badge></h4></InfoBoxShortUpper>
                <InfoBoxShortBottom>
                  Tutaj bedzie info o systemie plików
                </InfoBoxShortBottom>
              </InfoBoxShort>
          </Col>
        </Row>

        <Row>
          <Col>
              <InfoBoxLong>
                <InfoBoxLongUpper><h4><Badge bg="primary"><Image src={analyticsIcon} width={24} height={24}/> ANALIZA STATYSTYCZNA</Badge></h4></InfoBoxLongUpper>
                <InfoBoxLongBottom>
                  Tutaj analiza statystyczna
                </InfoBoxLongBottom>
              </InfoBoxLong>
            </Col>
        </Row>

        <Row>
          <Col>
              <InfoBoxShort>
                <InfoBoxShortUpper><h4><Badge bg="primary"><Image src={androidIcon} width={24} height={24}/> UPRAWNIENIA</Badge></h4></InfoBoxShortUpper>
                <InfoBoxShortBottomPermissions>
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th >Uprawnienie</th>
                        <th>Werdykt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((permission, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{permission}</td>
                        </tr>
                      ))}
                      {/* <tr>
                        <td>1</td>
                        <td>ANDROID.CAMERA</td>
                        <td><Badge bg="danger">NIEBEZPIECZNE</Badge></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>ANDROID.WAKE_LOCK</td>
                        <td><Badge bg="success">BEZPIECZNE</Badge></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>ANDROID.LOSOWE_DLUGIE_UPRAWNIENIE</td>
                        <td><Badge bg="success">BEZPIECZNE</Badge></td>
                      </tr> */}
                    </tbody>
                  </Table>
                </InfoBoxShortBottomPermissions>
              </InfoBoxShort>
          </Col>
          <Col>
                <InfoBoxShort>
                <InfoBoxShortUpper><h4><Badge bg="primary"><Image src={bugIcon} width={24} height={24}/> ANALIZA VIRUSTOTAL</Badge></h4></InfoBoxShortUpper>
                <InfoBoxShortBottom>
                  <div>
                    <ProgressBar>
                      <ProgressBar variant="success" now={vtHarmless} key={1} />
                      <ProgressBar variant="warning" now={vtSuspicious} key={2} />
                      <ProgressBar variant="danger" now={vtMalicious} key={3} />
                      <ProgressBar variant="secondary" now={vtUndetected} key={4} />
                    </ProgressBar>
                  </div>
                  <br/>
                  <h5><Badge bg="danger" text="light">Niebezpieczne</Badge> {vtMalicious} </h5>
                  <h5><Badge bg="success" text="light">Bezpieczne</Badge> {vtHarmless} </h5>
                  <h5><Badge bg="warning" text="dark">Podejrzane</Badge> {vtSuspicious} </h5>
                  <h5><Badge bg="secondary" text="light">Nie wykryto</Badge> {vtUndetected} </h5>
                  <h5><Badge bg="primary" text="light">Wynik Malwarebytes </Badge> {vtMalwareBytes} </h5>
                  <h5><Badge bg="primary" text="light">Wynik ClamAV </Badge> {vtClamAV} </h5>
                  <h5><Badge bg="primary" text="light">Wynik AVG </Badge> {vtAVG} </h5>
                </InfoBoxShortBottom>
              </InfoBoxShort>
          </Col>
        </Row>
      </Container>
    );
  }

