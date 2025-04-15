// components/Footer.jsx
import { Container, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaTelegram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container className="text-center">
        <h5>Нужен полный пакет документов? Свяжитесь с нами!</h5>
        <div className="mb-3">

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Написать в Telegram</Tooltip>}
          >
            <Button
              variant="outline-light"
              size="sm"
              className="mx-2"
              href="https://t.me/ikul23"
              target="_blank"
            >
              <FaTelegram className="me-1" /> Telegram
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Отправить email</Tooltip>}
          >
            <Button
              variant="outline-light"
              size="sm"
              className="mx-2"
              href="mailto:kompaniya.gisplyus@bk.ru"
            >
              <FaEnvelope className="me-1" /> Email
            </Button>
          </OverlayTrigger>

            <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Profi.ru</Tooltip>}
          >
            <Button
              variant="outline-light"
              size="sm"
              className="mx-2"
              href="https://profi.ru/profile/KuleshovIV14"
              target="_blank"
            >
              <FaEnvelope className="me-1" /> Страница на Profi.ru
            </Button>
          </OverlayTrigger>
        </div>

        <p className="mb-0 small">
          © {new Date().getFullYear()} Все права защищены. Компания "ГИС+"
        </p>
        <p className="mb-0 small">
          © {new Date().getFullYear()} All Rights Reserved. Company "GIS+"
        </p>
      </Container>
    </footer>
  );
}
