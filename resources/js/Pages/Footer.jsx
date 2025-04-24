import { Container, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaTelegram, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container className="text-center">
        <h5>{t("gallery_contact_prompt")}</h5>

        <div className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{t("contact_tooltip_telegram")}</Tooltip>}
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
            overlay={<Tooltip>{t("contact_tooltip_email")}</Tooltip>}
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
            overlay={<Tooltip>{t("contact_tooltip_profi")}</Tooltip>}
          >
            <Button
              variant="outline-light"
              size="sm"
              className="mx-2"
              href="https://profi.ru/profile/KuleshovIV14"
              target="_blank"
            >
              <FaEnvelope className="me-1" /> Profi.ru
            </Button>
          </OverlayTrigger>
        </div>


        <p className="mb-0 small">
          © {new Date().getFullYear()} {t("footer_rights")}
        </p>
          </Container>
    </footer>
  );
}
