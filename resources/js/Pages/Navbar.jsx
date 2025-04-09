import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">ИнвестКалькулятор</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Калькулятор</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/input">Ввод данных</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/results">Результаты</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Регистрация</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
