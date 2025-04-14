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

## <[<🚀Быстрый старт>](https://investment-calc.onrender.com)>

# Структура проекта

invest-calc/

├── app/

│ ├── Http/

│ │ ├── Controllers/
│ │ │ ├── CashflowController.php
│ │ │ ├── Controller.php
│ │ ├── InputDataController.php
│ │ ├──ProfileController.php
│ │ │ ├── Api/

│ │ │ │ └── TaskController.php

│ │ │ ├── Auth/
│ │ │ │ ├── AuthController.php

│ │ ├── Middleware/
│ │ └── Requests/

│ ├── Models/
│ │ ├── FinancialData.php
│ │ ├── InputData.php
│ │ ├── Project.php
│ │ ├── ProjectMetric.php
│ │ ├── Task.php
│ │ └── User.php
│ └── Providers/

├── bootstrap/

├── config/
│ ├── app.php
│ ├── auth.php
│ ├── cache.php
│ ├── cors.php
│ ├── database.php
│ ├── filesystems.php
│ ├── logging.php
│ ├── mail.php
│ ├── queue.php
│ ├── services.php
│ └── session.php

├── database/
├── docker/

├── node_modules/

├── public/

├── resources/
│ ├── css/

│ ├── js/

│ │ ├── components/

│ │ ├── Layouts/

│ │ ├── Pages/
│ │ │ ├── Auth/
│ │ │ ├── Profile/
│ │ │ ├── CalculatorPage.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── InputPage.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── Register.jsx
│ │ │ └── ResultsPage.jsx

│ │ ├── App.jsx
│ │ ├── bootstrap.js
│ │ └── main.jsx

│ ├── sass/

│ └── views/
│ ├── app.blade.php
│ ├── report.blade.php
│ └── task.blade.php

├── routes/
│ ├── api.php
│ ├── auth.php
│ └── console.php

├── storage/
│ ├── app/
│ ├── framework/
│ ├── logs/
│ ├── .gitignore
│ └── laravel.log

├── tests/

├── vendor/
│
├── .dockerignore

├── .editorconfig

├── .env

├── .env.example

├── .gitattributes

├── .gitignore

├── artisan

├── build.sh

├── Commands.pdf

├── composer.json

├── composer.lock

├── docker-compose.yml

├── jsonfig.json

├── package-lock.json

├── package.json

├── phpunit.xml

├── postcss.config.js

├── README.md

├── runtime.txt

├── tailwind.config.js

└── vite.config.js
