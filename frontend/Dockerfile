# Используем официальный образ Node.js для сборки
FROM node:20 AS build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install && \
    npm install -g vite

# Копируем весь исходный код в контейнер
COPY . .

# Запускаем приложение
CMD ["npm", "run", "dev"]
