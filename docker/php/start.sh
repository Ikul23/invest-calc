#!/bin/bash

# Генерация ключа, если не задан
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Миграции
php artisan migrate --force

# Запуск php-fpm и nginx (в фоновом режиме и foreground)
php-fpm -D
nginx -g "daemon off;"
