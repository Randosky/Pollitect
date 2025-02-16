#!/bin/sh
set -e

echo "Ожидание готовности PostgreSQL..."

# Ожидаем, пока PostgreSQL не станет доступен (используем netcat для проверки подключения)
until nc -z -v -w30 $DB_HOST 5432; do
  echo "Ожидание подключения к базе данных..."
  sleep 1
done

echo "База данных готова!"

echo "Запуск миграций..."
npx sequelize-cli db:migrate

echo "Запуск сервера..."
exec "$@"
