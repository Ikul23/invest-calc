#!/bin/bash
# Проверяем, есть ли APP_KEY
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Запускаем миграции, если нужно
php artisan migrate --force

service nginx start

# Запускаем основной процесс
exec php-fpm
