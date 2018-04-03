FROM php:7.2.3-apache-stretch
COPY serverfiles/ /var/www/html/
COPY serverconf/ /etc/apache2/
RUN cd /var/www/html/ && chown -R www-data:www-data *
