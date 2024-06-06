import React, { useState, useEffect, useRef } from "react";
import { Screen } from '../vncLib'
import { useNavigate, useBeforeUnload, isRouteErrorResponse } from "react-router-dom";
import './CssForVms.css'
import {ButtonsContainer, EmptyScreenVM, InfoBoxLong, InfoBoxLongUpper, InfoBoxLongBottom, InfoBoxShort, 
  InfoBoxShortUpper, InfoBoxShortBottom, InfoBoxShortBottomScrolled, InfoBoxShortBottomPermissions, InfoBoxLongBottomSection, 
  ButtonWithIcon, ButtonWithIcon2, WrapperDiv} from './StyledComp.js'

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
        'x-apikey': 'd6e08b45c8a7f54b61fd1146f1aaba112e3dc8685edae2ad204382b6fe2de515'}
      })
      .then(response => response.json())
      .then(data => {
        console.log('VirusTotal uploaded successfully:', data);
        analiseID(data.data.id)
      })
      .catch(error => {
        console.error('VirusTotal error uploading:', error);
      });


      // //SAMAT UPLOAD
      const formData2 = new FormData();
      formData2.append('formFile', file);

      fetch('http://192.168.199.160/VirtualMachine/Upload', {
        method: 'POST',
        body: formData2
      })
      .then(response => response)
      .then(data => {
        console.log('Upload successfull:', data);
        analiseSAMAT()
      })
      .catch(error => {
        console.error('Upload error:', error);
      });

      //HYBRID UPLOAD
      const formData3 = new FormData();
      formData3.append('file', file);
      formData3.append('environment_id', 200);

      fetch('https://hybrid-analysis.com/api/v2/submit/file', {
        method: 'POST',
        body: formData3,
        headers: {
        'api-key': '4daicrcrfb78a44dc564ygjea5c61f977y0tv6h1938a3170uu4drj5l7869d9e9'}
      })
      .then(response => response.json())
      .then(data => {
        console.log('Hybrid uploaded successfully:', data);
        analiseHybrid(data.job_id)
      })
      .catch(error => {
        console.error('Hybrid error uploading:', error);
      });

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
          'x-apikey': 'd6e08b45c8a7f54b61fd1146f1aaba112e3dc8685edae2ad204382b6fe2de515'
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
    const [samatFileSystem, setsamatFileSystem] = useState()
    const [samatProxy, setsamatProxy] = useState()

    async function analiseSAMAT () {
            //SAMAT SHOWFILESYSTEM
            await fetch('http://192.168.199.160/VirtualMachine/ShowFileSystem', {
              method: 'GET',
            })
            .then(response => response.text())
            .then(response => setsamatFileSystem(response))
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
            .then(response => response.text())
            .then(response => setsamatProxy(response))
            .then(data => {
              console.log('ShowProxy successfull:', data);
            })
            .catch(error => {
              console.error('ShowProxy error:', error);
            });
    }

    //HYBRID ANALYSIS

    async function analiseHybrid (jobId) {
      console.log(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/state`)
      fetch(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/state` , {
        method: 'GET',
        headers: {
          'api-key': '4daicrcrfb78a44dc564ygjea5c61f977y0tv6h1938a3170uu4drj5l7869d9e9'}
      })
      .then(response => response.json())
      .then(data => {
        console.log('Hybrid state successfully:', data);
        analiseHybridSuccess(jobId)
      })
      .catch(error => {
        console.error('Hybrid error state:', error);
      });
    }

    const [hybSHA1, sethybSHA1] = useState([])
    const [hybSHA256, sethybSHA256] = useState([])
    const [hybSHA512, sethybSHA512] = useState([])
    const [hybMD5, sethybMD5] = useState([])
    const [hybSize, sethybSize] = useState([])
    const [hybTime, sethybTime] = useState([])
    const [hybName, sethybName] = useState([])
    const [hybThreatScore, sethybThreatScore] = useState([])
    const [hybVerdict, sethybVerdict] = useState([])
    const [hybAttacks, sethybAttacks] = useState([])
    const [hybSignatures, sethybSignatures] = useState([])

    async function analiseHybridSuccess (jobId) {
      console.log(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/summary`)
      fetch(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/summary` , {
        method: 'GET',
        headers: {
          'api-key': '4daicrcrfb78a44dc564ygjea5c61f977y0tv6h1938a3170uu4drj5l7869d9e9'}
      })
      .then(response => response.json())
      .then(data => {
        console.log('Hybrid analysis successfully:', data);
        sethybSHA1(data.sha1);
        sethybSHA256(data.sha256)
        sethybSHA512(data.sha512)
        sethybMD5(data.md5)
        sethybSize(data.size)
        sethybTime(data.analysis_start_time)
        sethybName(data.submit_name)
        sethybThreatScore(data.threat_score)
        sethybVerdict(data.verdict)
        sethybAttacks(data.mitre_attcks)
        sethybSignatures(data.signatures)
      })
      .catch(error => {
        console.error('Hybrid error analysis:', error);
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
                        <div><Badge bg="dark">Nazwa pliku</Badge> {hybName}</div>
                        <div><Badge bg="dark">Ilość bajtów</Badge> {hybSize}</div>
                        <div><Badge bg="dark">MD5</Badge> {hybMD5}</div>
                        <div><Badge bg="dark">SHA1</Badge> {hybSHA1}</div>
                        <WrapperDiv><Badge bg="dark">SHA256</Badge> {hybSHA256}</WrapperDiv>
                        <WrapperDiv><Badge bg="dark">SHA512</Badge> {hybSHA512}</WrapperDiv>
                        <div><Badge bg="dark">Data analizy</Badge> {hybTime}</div>
                      </InfoBoxLongBottomSection>
                    </Col>
                    <Col>
                      <InfoBoxLongBottomSection>
                        <h4><Badge bg="dark" text="light">Wskaźnik niebezpieczeństwa</Badge> 
                        {hybThreatScore > 80 ?
                        <Badge bg="danger" text="light">{hybThreatScore}</Badge>
                        : hybThreatScore > 40 ?
                        <Badge bg="warning" text="dark">{hybThreatScore}</Badge>
                        : hybThreatScore > 10 ?
                        <Badge bg="success" text="light">{hybThreatScore}</Badge>
                        : <></>}
                        </h4>
                        <h4><Badge bg="dark" text="light">Werdykt</Badge> 
                        {hybVerdict === "malicious" ?
                        <Badge bg="danger" text="light">{hybVerdict}</Badge>
                        : hybVerdict === "safe" ? 
                        <Badge bg="success" text="light">{hybVerdict}</Badge>
                        : <Badge bg="warning" text="dark">{hybVerdict}</Badge>}
                        </h4>
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
                   {samatProxy}
                </InfoBoxShortBottomScrolled>
              </InfoBoxShort>
          </Col>
          <Col>
                <InfoBoxShort>
                <InfoBoxShortUpper><h4><Badge bg="primary"><Image src={folderIcon} width={24} height={24}/> SYSTEM PLIKÓW</Badge></h4></InfoBoxShortUpper>
                <InfoBoxShortBottomScrolled>
                  {samatFileSystem}
                </InfoBoxShortBottomScrolled>
              </InfoBoxShort>
          </Col>
        </Row>

        <Row>
          <Col>
              <InfoBoxLong>
                <InfoBoxLongUpper><h4><Badge bg="primary"><Image src={analyticsIcon} width={24} height={24}/> ANALIZA STATYCZNA</Badge></h4></InfoBoxLongUpper>
                <InfoBoxLongBottom>
                <Row>
                    <Col>
                      <InfoBoxLongBottomSection>
                      <h4><Badge bg="dark" text="light">Wykryte potencjalne ataki</Badge> </h4>
                      {hybAttacks.map((list, index)=>(
                        <><div><Badge key={index} bg="danger" text="light">{`Wykryty potencjalny atak`}</Badge> {list.tactic} </div>
                        <div><Badge key={index} bg="warning" text="dark">{`Użyta technika`}</Badge> {list.technique} </div> 
                        <div><Badge key={index} bg="warning" text="dark">{`Link do ataku`}</Badge> <a href={list.attck_id_wiki}>{list.attck_id_wiki}</a></div> 
                        <br/></>
                      ))}
                      </InfoBoxLongBottomSection>
                    </Col>
                    <Col>
                      <InfoBoxLongBottomSection>
                      <h4><Badge bg="dark" text="light">Wykryte sygnatury</Badge></h4>
                      {hybSignatures.map((list, index)=>(
                        <><div><Badge key={index} bg="danger" text="light">{`Wykryta sygnatura`}</Badge> {list.name} </div>
                        <div><Badge key={index} bg="warning" text="dark">{`Kategoria`}</Badge> {list.category} </div> 
                        <div><Badge key={index} bg="warning" text="dark">{`Opis`}</Badge> {list.description.slice(0,107)}</div> 
                        <br/></>
                      ))}
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
                      <tr>
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
                      </tr>
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

