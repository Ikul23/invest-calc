#!/bin/bash

cd /var/www

# Копируем .env.production только если нет .env
if [ "$APP_ENV" = "production" ]; then
    if [ ! -f .env ]; then
        cp .env.production .env
    fi
fi

# Очистка и кеширование конфигураций Laravel
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Генерация APP_KEY, если нужно
php artisan key:generate --force

# Оптимизация автозагрузки
composer dump-autoload --optimize

# Права
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Прогон миграций
php artisan migrate --force

# Запуск приложения
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
