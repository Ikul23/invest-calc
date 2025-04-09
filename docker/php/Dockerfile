FROM php:8.2-fpm

# Устанавливаем зависимости
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Очищаем кеш
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Устанавливаем Node.js и npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Создаем пользователя и группу www для запуска от непривилегированного пользователя
RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www

# Меняем права доступа к директории
COPY --chown=www:www . /var/www
RUN chown -R www:www /var/www

# Устанавливаем рабочую директорию
WORKDIR /var/www

USER www

EXPOSE 9000
CMD ["php-fpm"]
