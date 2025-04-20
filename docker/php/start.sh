#!/bin/bash

cd /var/www

# Копируем .env.production только если нет .env
if [ "$APP_ENV" = "production" ]; then
    if [ ! -f .env ]; then
        cp .env.production .env
    fi
fi

# Генерация APP_KEY, если нужно
if [ ! -f storage/oauth-private.key ]; then
    php artisan key:generate --force
fi

# Права
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Миграции
php artisan migrate --force

# Запускаем php-fpm как основной процесс
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
