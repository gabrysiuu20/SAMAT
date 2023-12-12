import tv from '../assets/tv_screen.png'
import { Screen } from '../vncLib'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={tv} className="App-logo" alt="logo" />
        <p>
          SAMAT version 1.0
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
