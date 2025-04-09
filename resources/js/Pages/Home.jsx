import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Основное содержимое */}
      <Container className="text-center my-auto py-5">
        <h1 className="mb-4 text-primary">
          Экспресс расчет оценки эффективности инвестиционного проекта
        </h1>
        <Link to="/input">
          <Button variant="success" size="lg" className="mb-5">
            Начать расчет
          </Button>
        </Link>

        <div className="mt-5 pt-5">
          <h4 className="mb-3">Контакты</h4>
          <div className="d-flex justify-content-center gap-4">
            <a href="https://t.me/ikul23" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              <Button variant="outline-primary">
                Telegram: @ikul23
              </Button>
            </a>
            <a href="mailto:kompaniya.gisplyus@bk.ru" className="text-decoration-none">
              <Button variant="outline-primary">
                Email: kompaniya.gisplyus@bk.ru
              </Button>
            </a>
          </div>
        </div>
      </Container>

      {/* Футер */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container className="text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Все права защищены. Компания "ГИС+"
          </p>
          <p className="mb-0">
            © {new Date().getFullYear()} All Rights Reserved. Company "GIS+"
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
