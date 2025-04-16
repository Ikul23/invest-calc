#!/bin/bash
set -e  # Остановка скрипта при любой ошибке

# Определение рабочей директории
WORK_DIR="/var/www/html"
cd $WORK_DIR

# Проверка окружения и настройка .env
if [ "$APP_ENV" = "production" ]; then
    echo "Running in production mode, setting up environment..."
    if [ -f $WORK_DIR/.env.production ]; then
        echo "Found .env.production, using it as main .env"
        cp $WORK_DIR/.env.production $WORK_DIR/.env
    else
        echo "Warning: .env.production not found!"
    fi
fi

# Очистка и кэш Laravel конфигурации
echo "Clearing and caching configuration..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Проверка подключения к базе данных перед миграцией
echo "Checking database connection..."
php artisan db:monitor --max=5 || { echo "Failed to connect to database"; exit 1; }

# Запуск миграций
echo "Running migrations..."
php artisan migrate --force

# Установка прав
echo "Setting permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Запуск PHP-FPM и Nginx
echo "Starting services..."
php-fpm -D
nginx -g "daemon off;"
