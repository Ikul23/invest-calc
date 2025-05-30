import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Pages/Navbar';
import InputPage from './Pages/InputPage';
import ResultsPage from './Pages/ResultsPage';
import Register from './Pages/Register';
import GalleryPage from './Pages/GalleryPage';
import PDFGallery from './Pages/GalleryPage';
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
          <Route path="/input" element={<InputPage />} />
          <Route path="/results/:project_id" element={<ResultsPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/documents" element={<PDFGallery />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
