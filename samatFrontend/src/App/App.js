import './App.css';
import FirstVm from '../components/FirstVm.js';
import SecondVm from '../components/SecondVm.js';
import MainPage from '../components/MainPage.js';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom'

export default function App() {
    return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/first-vm" element={<FirstVm />} />
          <Route path="/second-vm" element={<SecondVm />} />
        </Routes>
      </HashRouter>
    )
}