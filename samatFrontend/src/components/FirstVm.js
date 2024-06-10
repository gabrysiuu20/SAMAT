import React, { useState, useEffect, useRef } from "react";
import { Screen } from '../vncLib'
import { useNavigate, useBeforeUnload, isRouteErrorResponse } from "react-router-dom";
import './CssForVms.css'
import {ButtonsContainer, EmptyScreenVM, InfoBoxLong, InfoBoxLongUpper, InfoBoxLongBottom, InfoBoxShort, 
  InfoBoxShortUpper, InfoBoxShortBottom, InfoBoxShortBottomScrolled, InfoBoxShortBottomPermissions, InfoBoxLongBottomSection, 
  ButtonWithIcon, ButtonWithIcon2, WrapperDiv,
  Refresh} from './StyledComp.js'

import uploadIcon from '../assets/upload_file.svg'
import downloadIcon from '../assets/file_download.svg'
import displayIcon from '../assets/smart_display.svg'
import infoIcon from '../assets/info.svg'
import folderIcon from '../assets/folder.svg'
import analyticsIcon from '../assets/analytics.svg'
import bugIcon from '../assets/bug_report.svg'
import androidIcon from '../assets/android.svg'
import proxyIcon from '../assets/compare_arrows.svg'
import offIcon from '../assets/power_settings_new.svg'
import revertIcon from '../assets/history.svg'
import refreshIcon from '../assets/sync.svg'
import samatLogo from '../assets/samatnewlogo.png'

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
import Toast from 'react-bootstrap/Toast';
import RFB from '../noVNC/core/rfb.js'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const safePermissions = [
  "ACCESS_WIFI_STATE",
  "ACCESS_NETWORK_STATE",
  "INTERNET",
  "BLUETOOTH",
  "BLUETOOTH_ADMIN",
  "CHANGE_WIFI_STATE",
  "CHANGE_NETWORK_STATE",
  "VIBRATE",
  "WAKE_LOCK",
  "RECEIVE_BOOT_COMPLETED",
  "DISABLE_KEYGUARD",
  "GET_TASKS",
  "SYSTEM_ALERT_WINDOW",
  "USE_FINGERPRINT",
  "SET_TIME_ZONE",
  "SET_WALLPAPER",
  "SET_WALLPAPER_HINTS"
];

const dangerousPermissions = [
  "READ_CALENDAR",
  "WRITE_CALENDAR",
  "CAMERA",
  "READ_CONTACTS",
  "WRITE_CONTACTS",
  "GET_ACCOUNTS",
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION",
  "RECORD_AUDIO",
  "READ_PHONE_STATE",
  "CALL_PHONE",
  "READ_CALL_LOG",
  "WRITE_CALL_LOG",
  "ADD_VOICEMAIL",
  "USE_SIP",
  "PROCESS_OUTGOING_CALLS",
  "BODY_SENSORS",
  "SEND_SMS",
  "RECEIVE_SMS",
  "READ_SMS",
  "RECEIVE_WAP_PUSH",
  "RECEIVE_MMS",
  "READ_EXTERNAL_STORAGE",
  "WRITE_EXTERNAL_STORAGE",
  "ACCESS_BACKGROUND_LOCATION",
  "ACTIVITY_RECOGNITION"
];

const mediumPermissions = [
  "REQUEST_INSTALL_PACKAGES",
  "MANAGE_DOCUMENTS",
  "READ_SYNC_SETTINGS",
  "WRITE_SYNC_SETTINGS",
  "GET_PACKAGE_SIZE",
  "MOUNT_UNMOUNT_FILESYSTEMS",
  "ACCESS_LOCATION_EXTRA_COMMANDS",
  "RESTART_PACKAGES",
  "KILL_BACKGROUND_PROCESSES",
  "MODIFY_AUDIO_SETTINGS",
  "TRANSMIT_IR",
  "NFC",
  "BLUETOOTH_PRIVILEGED",
  "MANAGE_ACCOUNTS",
  "USE_CREDENTIALS",
  "SUBSCRIBED_FEEDS_READ",
  "SUBSCRIBED_FEEDS_WRITE",
  "READ_SYNC_STATS"
];


export default function MainPage({ isPending }) {
    const [vncUrl, setVncUrl] = useState(atob('d3M6Ly8xOTIuMTY4LjE5OS4xNjA6NzAwMA=='))
    const [uploadedFile, setUploadedFile] = useState("")
    const [chooseVnc, setchooseVnc] = useState("1")
    const vncScreenRef = useRef(null)
    //const columnsRef = useRef(null)

    const [showToastFile, setshowToastFile] = useState(false);

    const toggleShowToastFilee = () => setshowToastFile(!showToastFile);

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
      const fetchSamatStart = `http://192.168.199.160/VirtualMachine/StartVm?machine=` + chooseVnc
        fetch( fetchSamatStart, {
          method: 'GET'
        })
        .then(response => response)
        .then(data => {
          console.log('Start machine successfull:', data);
        })
        .catch(error => {
          console.error('Start machine error:', error);
        });
    }

    const offVnc = () => {
      const fetchSamatStop = `http://192.168.199.160/VirtualMachine/StopVm?machine=` + chooseVnc
        fetch( fetchSamatStop, {
          method: 'GET'
        })
        .then(response => response)
        .then(data => {
          console.log('Stop machine successfull:', data);
        })
        .catch(error => {
          console.error('Stop machine error:', error);
        });
    }

    const revertVnc = () => {
      const fetchSamatPurge = `http://192.168.199.160/VirtualMachine/PurgeMachine?machine=` + chooseVnc
      fetch( fetchSamatPurge, {
        method: 'GET'
      })
      .then(response => response)
      .then(data => {
        console.log('Purge successfull:', data);
      })
      .catch(error => {
        console.error('Purge error:', error);
      });
    }

    const handleSubmitFile = (e) => {
      setUploadedFile(e.target.files);
    }

    const hybridApiKey = 'bkxn73w1a48c3dcafc06shy390679c28otqqta3j0e3fc20cutw67n1042fa4ddc'

    const [hybridJobId, sethybridJobId] = useState("")
    const [vtJobId, setvtJobId] = useState("")
    
    async function sendFile() {

      var isFileValid = false
      const file = uploadedFile[0]
      
      if(file === undefined){
        isFileValid = false
        //console.log("Nie wybrano pliku")
      }
      else{
        isFileValid = true
        //console.log("Plik jest wybrany")
      }

      if(isFileValid){

        console.log("Wysyłanie do maszyny nr: ", chooseVnc)

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
          setvtJobId(data.data.id)
        })
        .catch(error => {
          console.error('VirusTotal error uploading:', error);
        });


        // //SAMAT UPLOAD
        const formData2 = new FormData();
        formData2.append('formFile', file);

        const fetchSamatUpload = `http://192.168.199.160/VirtualMachine/Upload?machine=` + chooseVnc
        fetch( fetchSamatUpload, {
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
          'api-key': `${hybridApiKey}`}
        })
        .then(response => response.json())
        .then(data => {
          console.log('Hybrid uploaded successfully:', data);
          analiseHybrid(data.job_id)
          sethybridJobId(data.job_id)
        })
        .catch(error => {
          console.error('Hybrid error uploading:', error);
        });
      }
      else{
        toggleShowToastFilee(true)
        console.log("Błąd: Wybierz plik!")
      }
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
    const [samatPermissions, setsamatPermissions] = useState([]);
    const [samatPackageName, setsamatPackageName] = useState()

    async function analiseSAMAT () {
            //SAMAT SHOWFILESYSTEM
            const fetchSamatFileSystem = `http://192.168.199.160/VirtualMachine/ShowFileSystem?machine=` + chooseVnc
            await fetch(fetchSamatFileSystem, {
              method: 'GET',
            })
            .then(response => response.text())
            .then(response => formatData(response))
            .then(response => setsamatFileSystem(response))
            .then(data => {
              console.log('ShowFileSystem successfull:', data);
            })
            .catch(error => {
              console.error('ShowFileSystem error:', error);
            });
      
            //SAMAT SHOWPROXY
            const fetchSamatShowProxy = `http://192.168.199.160/VirtualMachine/ShowProxy?machine=` + chooseVnc
            await fetch(fetchSamatShowProxy, {
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

            //SAMAT PERMISSIONS
            const fetchSamatPermissions = `http://192.168.199.160/VirtualMachine/ShowPermissions?machine=` + chooseVnc
            fetch(fetchSamatPermissions, {
              method: 'GET',
            })
            .then(response => response.text())
            .then(response => {
              const rows = response.split('\n');
              rows.pop()
              //console.log(rows)
              setsamatPermissions(rows);
            })                
            .then(data => {
              console.log('ShowPermission successfull:', data);
            })
            .catch(error => {
              console.error('ShowPermission error:', error);
            });

            //SAMAT SHOWPACKAGE
            const fetchSamatPackage = `http://192.168.199.160/VirtualMachine/ShowPackageName`
            await fetch(fetchSamatPackage, {
              method: 'GET',
            })
            .then(response => response.text())
            .then(response => setsamatPackageName(response))
            .then(data => {
              console.log('ShowPackage successfull:', data);
            })
            .catch(error => {
              console.error('ShowPackage error:', error);
            });
    }

    //HYBRID ANALYSIS

    async function analiseHybrid (jobId) {
      console.log(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/state`)
      fetch(`https://hybrid-analysis.com/api/v2/report/` + jobId + `/state` , {
        method: 'GET',
        headers: {
          'api-key': `${hybridApiKey}`}
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
          'api-key': `${hybridApiKey}`}
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

    //PERMISSIONS SAMAT ANALYSIS 

    const categorizePermission = (permission) => {
      const startIndex = permission.split(".");
      const phrase = startIndex[2]
      if (dangerousPermissions.includes(phrase)) {
        return 'danger';
      } else if (mediumPermissions.includes(phrase)) {
        return 'warning';
      } else if (safePermissions.includes(phrase)) {
        return 'success';
      } else {
        return 'secondary';
      }
    }
  
    const getBadgeText = (permission) => {
      const startIndex = permission.split(".");
      const phrase = startIndex[2]
      if (dangerousPermissions.includes(phrase)) {
        return 'DANGEROUS';
      } else if (mediumPermissions.includes(phrase)) {
        return 'MEDIUM';
      } else if (safePermissions.includes(phrase)) {
        return 'SAFE';
      } else {
        return 'UNCOMMON';
      }
    }

    const formatData = (inputData) => {
      const formattedData = inputData.replace(/(\+{3}.*?)(@@)/g, '$1\n$2')
                                      .replace(/(\-{3}.*?)(\+{3})/g, '$1\n$2')
                                      .replace(/(\@\@.*?)(\|)/g, '$1\n$2')
                                      .replace(/\|-/g, '|-')
                                      .replace(/\| \|-/g, '|-')
                                      .replace(/\| \|\|-/g, '|-');
    
      return formattedData.split('\n').map(line => line.trim()).filter(Boolean);
    };


    function refreshVnc() {
      console.log("Odświeżanie ...")
      analiseSAMAT();
      analiseHybridSuccess(hybridJobId);
      analiseID(vtJobId);
    }

    return (<>
      <Navbar sticky='top' bg="primary" data-bs-theme="dark" >
      <Container>
        <Navbar.Brand href="/" className="brand-logo">
        <img
              width={32}
              height={32}
              src={samatLogo}
              alt="Logo"
            />
          SAMAT</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link active={true} href="first-vm">ANDROID 9 (Android-x86)</Nav.Link>
          <Nav.Link href="second-vm">ANDROID 12 (BlissOS)</Nav.Link>
        </Nav>
      </Container>
      </Navbar>
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
                    <b>WŁĄCZ</b>
                    </ButtonWithIcon>
                </Button>
                <Button variant="info" onClick={() => offVnc()}>
                <ButtonWithIcon>
                    <Image src={offIcon} width={24} height={24}/>
                    <b>WYŁĄCZ</b>
                    </ButtonWithIcon>
                </Button>
                <Button variant="info" onClick={() => revertVnc()}>
                <ButtonWithIcon>
                    <Image src={revertIcon} width={24} height={24}/>
                    <b>PRZYWRÓĆ</b>
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
                <Toast show={showToastFile} onClose={toggleShowToastFilee}>
                  <Toast.Header>
                    <strong className="me-auto">Błąd - brak pliku do analizy</strong>
                    <small></small>
                  </Toast.Header>
                  <Toast.Body>Należy wybrać plik .apk do analizy</Toast.Body>
                </Toast>
                <Button variant="secondary" onClick={() => refreshVnc()}>
                    <ButtonWithIcon2>
                    <Image src={refreshIcon} width={24} height={24}/>
                    <b>ODŚWIEŻ</b>
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
                        <WrapperDiv><div><Badge bg="dark">Nazwa pliku</Badge> {samatPackageName}</div></WrapperDiv>
                        <div><Badge bg="dark">Ilość bajtów</Badge> {hybSize}</div>
                        <div><Badge bg="dark">MD5</Badge> {hybMD5}</div>
                        <div><Badge bg="dark">SHA1</Badge> {hybSHA1}</div>
                        <WrapperDiv><Badge bg="dark">SHA256</Badge> {hybSHA256}</WrapperDiv>
                        <WrapperDiv><Badge bg="dark">SHA512</Badge> {hybSHA512}</WrapperDiv>
                        
                      </InfoBoxLongBottomSection>
                    </Col>
                    <Col>
                      <InfoBoxLongBottomSection>
                        <div className="verdict-box"><h4><Badge bg="dark" text="light">Wskaźnik niebezpieczeństwa</Badge></h4>
                        <h4>
                        {hybThreatScore > 80 ?
                        <Badge bg="danger" text="light">{hybThreatScore}</Badge>
                        : hybThreatScore > 40 ?
                        <Badge bg="warning" text="dark">{hybThreatScore}</Badge>
                        : hybThreatScore > 10 ?
                        <Badge bg="success" text="light">{hybThreatScore}</Badge>
                        : <></>}
                        </h4></div>
                        <div className="verdict-box"><h4><Badge bg="dark" text="light">Werdykt</Badge></h4>
                        <h4>
                        {hybVerdict === "malicious" ?
                        <Badge bg="danger" text="light">{hybVerdict}</Badge>
                        : hybVerdict === "safe" ? 
                        <Badge bg="success" text="light">{hybVerdict}</Badge>
                        : <Badge bg="warning" text="dark">{hybVerdict}</Badge>}
                        </h4></div>
                        {/* <div><Badge bg="dark">Data analizy</Badge> {hybTime}</div> */}
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
                  {samatFileSystem ? samatFileSystem.map((line, index) => (
                    <span key={index}>{line}</span>
                  )) : <div></div>}
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
                        <br key={index}/></>
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
                      {samatPermissions.map((permission, index) => 
                          (
                            <tr key={index}>
                              <td>
                                {index+1}
                              </td>
                              <td>
                                {permission}
                              </td>
                              <td>
                                <Badge bg={categorizePermission(permission)}>
                                  {getBadgeText(permission)}
                                </Badge>
                              </td>
                            </tr>
                          )
                        )
                      }                  
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
      </>
    );
  }

