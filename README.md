# Инвестиционный калькулятор (Laravel + React SPA)

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)

# Investment Calculator (Laravel + React SPA)

## Tech Stack

### Backend

-   **Laravel 11** (REST API)
-   **PostgreSQL 15** (primary database)
-   **Redis** (caching)
-   **Sanctum** (authentication)

### Frontend

-   **React 18** (SPA)
-   **React Router** (navigation)
-   **Axios** (HTTP client)
-   **Bootstrap 5** (styling)

### Infrastructure

-   **Docker** (containerization)
-   **Docker Compose** (orchestration)

### Testing

-   **Jest** + **React Testing Library** (frontend)
-   **PHPUnit** (backend)

### Hosting

-   **Nginx** server for frontend and API distribution
-   Hosting: **Render**

### [<Investment Calculator>](https://invest-calc-2ypa.onrender.com)

# 投资计算器 (Laravel + React SPA)

## 技术栈

### 后端

-   **Laravel 11** (REST API)
-   **PostgreSQL 15** (主数据库)
-   **Redis** (缓存)
-   **Sanctum** (身份验证)

### 前端

-   **React 18** (单页应用)
-   **React Router** (路由导航)
-   **Axios** (HTTP 客户端)
-   **Bootstrap 5** (样式设计)

### 基础设施

-   **Docker** (容器化)
-   **Docker Compose** (容器编排)

### 测试

-   **Jest** + **React Testing Library** (前端测试)
-   **PHPUnit** (后端测试)

### 托管

-   **Nginx** 服务器用于前端和 API 分发
-   托管平台: **Render**

### [<投资计算器>](https://invest-calc-2ypa.onrender.com)

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

## <[<🚀Инвестиционный калькулятор>](https://invest-calc-2ypa.onrender.com)>

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

resources/lang/
├── en/
│ └── messages.php
├── ru/
│ └── messages.php
├── zh/
│ └── messages.php

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

│ │ ├── constants.js
│ │ ├── app.js
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

├── render.yaml

└── vite.config.js

invest-calc/
├── 📁 app/ # Основное приложение Laravel
├── 📁 bootstrap/ # Файлы инициализации приложения
├── 📁 config/ # Конфигурационные файлы
├── 📁 database/ # Миграции, сидеры и фабрики
│ ├── 📁 migrations/ # Миграции базы данных
│ └── 📁 seeders/ # Наполнители базы данных
├── 📁 docker/ # Docker-конфигурации
├── 📁 node_modules/ # Зависимости Node.js (автоматически генерируется)
├── 📁 public/ # Публичные файлы (компилируемые ресурсы)
├── 📁 resources/ # Ресурсы приложения
│ ├── 📁 js/ # JavaScript-файлы
│ └── 📁 views/ # Blade-шаблоны
├── 📁 routes/ # Маршруты приложения
│ ├── api.php # API-маршруты
│ └── web.php # Web-маршруты
├── 📁 storage/ # Файлы хранилища
│ ├── 📁 app/ # Файлы приложения
│ ├── 📁 framework/ # Файлы фреймворка
│ └── 📁 logs/ # Логи приложения
├── 📁 tests/ # Тесты приложения
├── 📁 vendor/ # Зависимости Composer (автоматически генерируется)
├── 📄 .dockerignore # Игнорируемые файлы для Docker
├── 📄 .editorconfig # Настройки редактора кода
├── 📄 .env.production # Переменные окружения для production
├── 📄 .env # Переменные окружения для development
├── 📄 .env.example # Шаблон переменных окружения
├── 📄 .gitattributes # Атрибуты Git
├── 📄 .gitignore # Игнорируемые файлы Git
├── 📄 artisan # CLI-интерфейс Laravel
├── 📄 build.sh # Скрипт сборки
├── 📄 composer.json # Конфигурация Composer
├── 📄 composer.lock # Версии зависимостей Composer
├── 📄 docker-compose.yml # Конфигурация Docker Compose
├── 📄 jsconfig.json # Конфигурация JavaScript
├── 📄 package.json # Конфигурация Node.js
├── 📄 package-lock.json # Версии зависимостей Node.js
├── 📄 phpunit.xml # Конфигурация PHPUnit
├── 📄 postcss.config.js # Конфигурация PostCSS
├── 📄 README.md # Документация проекта
├── 📄 runtime.txt # Конфигурация времени выполнения
├── 📄 tailwind.config.js # Конфигурация Tailwind CSS
└── 📄 vite.config.js # Конфигурация Vite
