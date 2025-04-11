#!/bin/bash
set -e

# Очистка кеша
echo "➤ Cleaning caches..."
rm -rf vendor/ node_modules/ composer.lock package-lock.json

# Установка PHP зависимостей
echo "➤ Installing PHP dependencies..."
composer install --no-interaction --optimize-autoloader --no-dev

# Установка Node.js
echo "➤ Installing Node.js dependencies..."
npm ci --no-audit --prefer-offline

# Сборка фронтенда
echo "➤ Building frontend assets..."
npm run build

echo "✓ Build completed successfully!"
