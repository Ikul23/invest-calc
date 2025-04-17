#!/bin/bash

set -e

cd /var/www/html

# Удаляем .env, если он случайно попал в контейнер
rm -f .env

# Генерация APP_KEY, если переменная пуста
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Очистка кэшей перед миграциями
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Кэшируем конфиги после очистки
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Запуск миграций
php artisan migrate --force

# Устанавливаем права на storage и bootstrap/cache
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Запуск php-fpm в фоне
php-fpm &

# Запуск nginx как основного процесса (чтобы контейнер не завершился)
exec nginx -g 'daemon off;'
