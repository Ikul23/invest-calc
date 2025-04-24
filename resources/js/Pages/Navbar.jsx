import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">{t('title')}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t('calculate')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/input">{t('input')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/results">{t('results')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">{t('examples')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">{t('register')}</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-light" onClick={() => changeLanguage('ru')}>RU</button>
            <button className="btn btn-sm btn-outline-light" onClick={() => changeLanguage('en')}>EN</button>
            <button className="btn btn-sm btn-outline-light" onClick={() => changeLanguage('zh')}>中文</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
