#!/bin/bash
set -e

cd /var/www/html

# Проверим наличие .env.production
if [ "$APP_ENV" = "production" ] && [ -f .env.production ]; then
    echo "✅ Copying .env.production to .env"
    cp .env.production .env
else
    echo "⚠️  .env.production not found or APP_ENV is not production"
fi

# Очистим старый кэш (если вдруг остался)
php artisan config:clear

# Выведем текущую переменную DB_HOST (для дебага)
echo "DB_HOST from Laravel env: $(php -r "require 'vendor/autoload.php'; echo env('DB_HOST');")"

# Кэшируем конфигурации Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Применим миграции
php artisan migrate --force

# Установим права
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Запускаем PHP-FPM и Nginx
php-fpm -D
nginx -g "daemon off;"
