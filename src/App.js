import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import PreRegister from './pages/PreRegister';

function App() {
  return (
    <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/pre-register" element={<PreRegister />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
