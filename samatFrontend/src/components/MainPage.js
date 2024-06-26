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
import slide1 from '../assets/slide1.png'
import slide2 from '../assets/slide2.jpg'
import slide3 from '../assets/slide3.jpg'
import slide4 from '../assets/slide4.jpg'
import slide5 from '../assets/slide5.jpg'
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
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';

import Carousel from 'react-bootstrap/Carousel';
//import ExampleCarouselImage from 'components/ExampleCarouselImage';


export default function MainPage({ isPending }) {
    const [vncUrl, setVncUrl] = useState("")
    const [uploadedFile, setUploadedFile] = useState("")

    
    

    return (
      <>
        <Navbar sticky='top' bg="primary" data-bs-theme="dark" >
          <Container>
            <Navbar.Brand href="" className="brand-logo">
            <img
                  width={32}
                  height={32}
                  src={samatLogo}
                  alt="Logo"
                />
              SAMAT</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#first-vm">ANDROID 9 (Android-x86)</Nav.Link>
              <Nav.Link href="#second-vm">ANDROID 12 (BlissOS)</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
          {/* <Alert variant='primary'>
            Wybierz jedną z maszyn wirtualnych w menu !
          </Alert> */}
            {/* <Carousel className="carousel-container">
              <Carousel.Item>
                <img
                  className="slide-container"
                  src={slide4}
                  alt="First slide"
                />
                <Carousel.Caption className="samat-text">
                  <h3>Wybierz aplikację do analizy</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="slide-container"
                  src={slide5}
                  alt="First slide"
                />
                <Carousel.Caption className="samat-text">
                  <h3>Stwórz swoją piaskownicę</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <img
                  className="slide-container"
                  src={slide1}
                  alt="First slide"
                />
                <Carousel.Caption className="samat-text">
                  <h3>Zobacz wyniki analizy</h3>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel> */}
            </>
    );
  }

