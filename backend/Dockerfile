# Используем официальный Node.js образ (версия 20)
FROM node:20

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Обновляем списки пакетов и устанавливаем netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код в контейнер
COPY . .

# Копируем скрипт entrypoint и делаем его доступным
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Указываем точку входа для контейнера
ENTRYPOINT ["docker-entrypoint.sh"]

# Команда по умолчанию – запуск сервера (ts-node для TypeScript)
CMD ["npx", "ts-node", "src/server.ts"]
