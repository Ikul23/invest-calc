#!/bin/bash
set -e

# Установка PHP зависимостей
echo "➤ Installing PHP dependencies..."
composer install --no-interaction --optimize-autoloader --no-dev

# Установка Node.js зависимостей
echo "➤ Installing Node.js dependencies..."
npm ci --no-audit

# Сборка фронтенда
echo "➤ Building frontend assets..."
npm run build

# Очистка кеша
echo "➤ Optimizing application..."
php artisan optimize:clear

echo "✓ Build completed successfully!"
