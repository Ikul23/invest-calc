// src/Pages/Home.jsx
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t, i18n } = useTranslation();

      const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('lang', lng);
      };
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="text-center my-auto py-5">
        <h1 className="mb-4 text-primary">
           {t("title_home")}
        </h1>
        <Link to="/input">
          <Button variant="success" size="lg" className="mb-5 px-4 py-2">
             {t("start_button")}
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
