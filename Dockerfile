# Используем официальный PHP с FPM
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
    nginx \
    nodejs \
    npm \
    gnupg2 \
    && apt-get clean

# Установка PHP-расширений
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Задание рабочей директории
WORKDIR /var/www/html

# Копируем проект в контейнер
COPY . .

# Установка зависимостей
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Копируем Nginx конфиг
COPY docker/nginx/conf.d/app.conf /etc/nginx/sites-available/default

# Копируем start.sh и делаем исполняемым
COPY docker/php/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Открываем порт
EXPOSE 80

# Запуск контейнера
CMD ["/usr/local/bin/start.sh"]
