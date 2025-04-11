# Инвестиционный калькулятор (Laravel + React SPA)

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)

## 📦 Технологический стек

### Backend

-   **Laravel 11** (REST API)
-   **PostgreSQL 15** (основная БД)
-   **Redis** (кеширование)
-   **Sanctum** (аутентификация)

### Frontend

-   **React 18** (SPA)
-   **React Router** (навигация)
-   **Axios** (HTTP-клиент)
-   **Bootstrap 5** (стилизация)

### Инфраструктура

-   **Docker** (контейнеризация)
-   **Docker Compose** (оркестрация)

### Тестирование

-   **Jest** + **React Testing Library** (фронтенд)
-   **PHPUnit** (бэкенд)

### Хостинг

-   **Nginx** сервер для раздачи фронта и API Хостинг - **Render**

## 🚀 Быстрый старт

# Структура проекта

├── invest-calc/
│ ├── app/
│ │ ├── Http/
│ │ ├── Models/
│ │ └── Providers/
│ ├── bootstrap/
│ ├── config/
│ ├── database/
│ ├── docker/
│ ├── nginx/
│ │ └── conf.d/
│ │ └── app.conf
│ ├── php/
│ │ └── Dockerfile
│ ├── public/
│ ├── resources/
│ ├── App.jsx (роутинг)
│ ├── Pages/
│ ├── Home.jsx
│ ├── Navbar.jsx (навигация с NavLink)
│ ├── InputPage.jsx (отправка данных + navigate)
│ ├── ResultsPage.jsx (получение данных через useLocation)
│ ├── CalculatorPage.jsx
│ └── Register.jsx
│ ├── routes/
│ ├── storage/
│ ├── tests/
│ ├── vendor/
│ ├── node_modules/
│ ├── localhost/
│ ├── .editorconfig
│ ├── .env
│ ├── .env.example
│ ├── .gitattributes
│ ├── .gitignore
│ ├── artisan
│ ├── composer.json
│ ├── composer.lock
│ ├── docker-compose.yml
│ ├── package-lock.json
│ ├── package.json
│ ├── phpunit.xml
│ ├── postcss.config.js
│ ├── README.md
│ ├── tailwind.config.js
│ └── vite.config.js

## <[Веб адрес](https://investment-calc.onrender.com)>
