FROM php:7.2.3-apache-stretch

LABEL maintainer="mir4p"

# Copy serverfiles to server
COPY serverfiles/ /var/www/html/

# Modify permissions for server files
RUN cd /var/www/html/ && chown -R www-data:www-data *
