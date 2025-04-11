// src/Pages/Home.jsx
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="text-center my-auto py-5">
        <h1 className="mb-4 text-primary">
          Экспресс расчет оценки эффективности инвестиционного проекта
        </h1>
        <Link to="/input">
          <Button variant="success" size="lg" className="mb-5 px-4 py-2">
            Начать расчет
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
