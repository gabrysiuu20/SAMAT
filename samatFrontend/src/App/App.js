import './App.css';
import FirstVm from '../components/FirstVm.js';
import SecondVm from '../components/SecondVm.js';
import MainPage from '../components/MainPage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/first-vm" element={<FirstVm />} />
          <Route path="/second-vm" element={<SecondVm />} />
        </Routes>
      </Router>
    )
}