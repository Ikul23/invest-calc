#!/bin/bash
set -e

cd /var/www/html

# Удаляем .env, если он случайно был скопирован
rm -f .env

# Печатаем текущий DB_HOST, чтобы увидеть, что реально подставилось
echo "DB_HOST from Laravel env: $DB_HOST"

# Очистка кэша (на всякий случай перед миграциями)
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Кэширование снова
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Миграции
php artisan migrate --force

# Права
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Стартуем
php-fpm -D
nginx -g "daemon off;"
