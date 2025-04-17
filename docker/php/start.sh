#!/bin/bash
set -e  # Остановить скрипт при любой ошибке

cd /var/www/html

# Кэширование конфигураций Laravel
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Применить миграции
php artisan migrate --force

# Установить права
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Запустить PHP-FPM и Nginx
php-fpm -D
nginx -g "daemon off;"
