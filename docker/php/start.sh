#!/bin/bash

# Очистка и кэш конфигурации Laravel
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Установка прав
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Запуск php-fpm в фоне
php-fpm -D

# Запуск nginx в форграунде
nginx -g "daemon off;"
