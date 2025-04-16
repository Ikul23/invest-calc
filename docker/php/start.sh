#!/bin/bash

# Перемещение в рабочую директорию на всякий случай
cd /var/www

# Очистка и кэш Laravel конфигурации
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Проверка и запуск миграций (особенно если SESSION_DRIVER=database)
php artisan migrate --force

# Установка прав
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Запуск PHP-FPM
php-fpm -D

# Запуск Nginx в форграунде
nginx -g "daemon off;"
