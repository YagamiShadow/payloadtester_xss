FROM php:7.2.3-apache-stretch

LABEL maintainer="secf00tprint"

# Copy serverfiles to server
COPY serverfiles/ /var/www/html/
COPY config/ /etc/apache2/
RUN a2enmod headers

# Modify permissions for server files
RUN cd /var/www/html/ && chown -R www-data:www-data *
