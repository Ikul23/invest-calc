#!/bin/bash

# Генерация ключа
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Миграции
php artisan migrate --force

# Запуск Laravel напрямую
exec php artisan serve --host=0.0.0.0 --port=8080
