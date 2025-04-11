#!/bin/bash
set -e

echo "➤ Installing PHP dependencies..."
composer install --no-interaction --optimize-autoloader --no-dev

echo "➤ Building frontend assets..."
npm install
npm run build

echo "✓ Build completed!"
