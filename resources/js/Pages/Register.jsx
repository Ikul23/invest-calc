import Footer from '../Pages/Footer';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Register() {
     const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.get('/sanctum/csrf-cookie');
    try {
      const res = await axios.post('/api/register', form);
      console.log(res.data);
      // Можно добавить редирект после успешной регистрации
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4>{t("title_register")}</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">{t("name")}</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("email")}</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("password")}</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("password_confirmation")}</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {t("submit")}
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <Link to="/login">{t("loginLink")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
