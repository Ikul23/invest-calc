#!/usr/bin/env bash
# Exit on error
set -e

# Build frontend
npm ci
npm run build

# Build backend
composer install --no-dev
php artisan migrate --force