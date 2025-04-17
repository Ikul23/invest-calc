#!/bin/bash

# Генерация APP_KEY, если нужно
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Запуск миграций
php artisan migrate --force

# Запуск php-fpm в фоне
php-fpm &

# Запуск nginx как основного процесса (чтобы контейнер не падал)
exec nginx -g 'daemon off;'
