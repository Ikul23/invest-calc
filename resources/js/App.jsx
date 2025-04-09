import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Pages/Navbar';
import CalculatorPage from './Pages/CalculatorPage';
import InputPage from './Pages/InputPage';
import ResultsPage from './Pages/ResultsPage';
import Register from './Pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../css/app.css';
import 'typeface-roboto';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calc" element={<CalculatorPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
