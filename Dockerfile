FROM php:8.2-fpm

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    npm \
    nodejs \
    gnupg2

# PHP расширения
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Рабочая директория
WORKDIR /var/www

# Копируем все файлы
COPY . .

# Устанавливаем зависимости PHP и JS
RUN composer install --no-dev --optimize-autoloader \
    && npm install && npm run build

# Установка Nginx
RUN apt-get update && apt-get install -y nginx

# Копирование конфигурации Nginx
COPY docker/nginx/conf.d/app.conf /etc/nginx/sites-available/default


# Открываем порт
EXPOSE 80


COPY docker/php/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Запускаем скрипт при старте контейнера
CMD ["/usr/local/bin/start.sh"]
