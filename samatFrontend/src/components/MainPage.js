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

import Carousel from 'react-bootstrap/Carousel';
//import ExampleCarouselImage from 'components/ExampleCarouselImage';


export default function MainPage({ isPending }) {
    const [vncUrl, setVncUrl] = useState("")
    const [uploadedFile, setUploadedFile] = useState("")
    


    const formatData = (inputData) => {
      const formattedData = inputData.replace(/(\+{3}.*?)(@@)/g, '$1\n$2')
                                      .replace(/(\-{3}.*?)(\+{3})/g, '$1\n$2')
                                      .replace(/(\@\@.*?)(\|)/g, '$1\n$2')
                                      .replace(/\|-/g, '|-')
                                      .replace(/\| \|-/g, '|-')
                                      .replace(/\| \|\|-/g, '|-');
    
      return formattedData.split('\n').map(line => line.trim()).filter(Boolean);
    };

    return (
      <>
      <Container fluid="xl" className="main-container">
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="">SAMAT</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="first-vm">MASZYNA WIRTUALNA 1</Nav.Link>
              <Nav.Link href="second-vm">MASZYNA WIRTUALNA 2</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </Container>
              <Carousel className="carousel-container">
              <Carousel.Item>
                <img
                  className="slide-container"
                  src={slide1}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Wybierz aplikację do analizy</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="slide-container"
                  src={slide2}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Stwórz swoją piaskownicę</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <img
                  className="slide-container"
                  src={slide3}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Zobacz wyniki analizy</h3>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            </>
    );
  }

