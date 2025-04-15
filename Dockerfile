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

# Генерация ключа
RUN php artisan key:generate

# Открываем порт
EXPOSE 8000

# Запускаем встроенный сервер Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
