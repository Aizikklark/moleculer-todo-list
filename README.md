
# Проект TODO List на Moleculer

Этот проект представляет собой простое приложение для управления списком задач (todo-list), построенное с использованием Moleculer, мощного фреймворка для создания микросервисов на Node.js. В качестве базы данных используется PostgreSQL.

## Структура проекта

```plaintext
Moleculer-Todo-List/
├── services/
│   ├── api.service.js     # Сервис API Gateway
│   └── todo.service.js    # Основной сервис для управления задачами TODO
├── test/
│   └── todo.service.test.js  # Тест для сервиса TODO
├── .env                    # Файл конфигурации окружения
├── .editorconfig           # Конфигурация редактора кода
├── .eslintrc.js            # Конфигурация ESLint для линтинга кода
├── moleculer.config.js     # Конфигурация Moleculer
├── package.json            # Файл конфигурации npm
└── README.md               # Текущий файл
```

## Предварительные требования

- Node.js (v14.x или новее)
- npm (v6.x или новее)
- PostgreSQL (v12 или новее)

## Установка

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/Aizikklark/moleculer-todo-list.git
    cd moleculer-todo-list
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

3. Настройте базу данных PostgreSQL:

    - Создайте базу данных с именем `todo_db` (или выберите другое имя по вашему усмотрению).
    - Создайте пользователя с соответствующими правами для доступа к базе данных.

4. Создайте файл `.env` в корневом каталоге проекта и добавьте в него конфигурацию базы данных:

    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_username
    DB_PASS=your_password
    DB_NAME=todo_db
    PORT=3000
    ```

## Запуск проекта

### В режиме разработки

Для запуска в режиме разработки используйте команду:

```bash
npm run dev
```

### В режиме продакшн

Для запуска в режиме продакшн используйте команду:

```bash
npm run start
```

### Приложение запустится и будет доступно по адресу 
```http://localhost:3000```.


## Запуск тестов

Для запуска всех тестов используйте команду:

```bash
npm test
```

Для запуска только тестов сервиса TODO:

```bash
npm test -- test/todo.service.test.js
```


## CRUD операции

Сервис TODO предоставляет следующие CRUD операции:

- **Создание новой задачи TODO**
  - **POST** `/api/todos`
  - Тело запроса:
    ```json
    {
      "title": "Новая задача",
      "description": "Описание задачи"
    }
    ```

- **Получение всех задач TODO**
  - **GET** `/api/todos`

- **Получение одной задачи TODO по ID**
  - **GET** `/api/todos/:id`

- **Обновление задачи TODO**
  - **PUT** `/api/todos/:id`
  - Тело запроса:
    ```json
    {
      "title": "Обновленное название задачи",
      "description": "Обновленное описание задачи",
      "completed": true
    }
    ```

- **Удаление задачи TODO**
  - **DELETE** `/api/todos/:id`


## Благодарности

- [Moleculer](https://moleculer.services/) - Прогрессивный фреймворк для микросервисов на Node.js.
- [PostgreSQL](https://www.postgresql.org/) - Мощная, открытая объектно-реляционная система управления базами данных.

## Автор

- **Василий** - (https://github.com/Aizikklark)