require("dotenv").config();

const DbMixin = require("moleculer-db");
const Sequelize = require("sequelize");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
// Строка подключения к базе данных, используя переменные окружения
const dbUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

module.exports = {
	name: "todos",
	mixins: [DbMixin],
	adapter: new SqlAdapter(dbUrl), // Используем переменную dbUrl для подключения
	model: {
		name: "Todo",
		define: {
			title: Sequelize.STRING,
			description: Sequelize.STRING,
			completed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
		},
	},
	settings: {
		rest: {
			// Настройки для REST API
			path: "/todos",
			// Включение CORS
			cors: true,
			// Настройка заголовков ответа
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		},
		// Настройки для пагинации
		pageSize: 10,
		maxPageSize: 50,
		// Пример настроек валидации данных
		entityValidator: {
			title: { type: "string", min: 3, max: 255 },
			description: { type: "string", optional: true },
			completed: { type: "boolean", optional: true },
		},
		// Настройки для синхронизации базы данных
		db: {
			// Параметры синхронизации (для sequelize)
			sync: true, // Автоматическое создание таблиц
			alter: false, // Не изменять существующие таблицы
		},
	},

	actions: {
		create: {
			rest: {
				method: "POST",
				path: "/",
			},
			async handler(ctx) {
				const { title, description } = ctx.params;

				console.log("Получен запрос на создание новой задачи");

				// Валидация данных
				if (!title || title.trim().length < 3) {
					console.error(
						"Заголовок задачи не должен быть пустым и должен содержать не менее 3 символов",
					);
					throw new Error(
						"Заголовок задачи не должен быть пустым и должен содержать не менее 3 символов",
					);
				}

				try {
					const todo = await this.adapter.insert({
						title,
						description,
						completed: false,
					});

					console.log(`Задача с ID ${todo.id} успешно создана`);

					return todo;
				} catch (error) {
					console.error("Ошибка при создании задачи:", error);
					throw new Error("Не удалось создать задачу");
				}
			},
		},

		list: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler() {
				console.log("Получен запрос на получение всех задач");

				try {
					const todos = await this.adapter.find({});

					if (todos.length === 0) {
						console.warn("Список задач пуст");
					} else {
						console.log(`Найдено ${todos.length} задач(и)`);
					}

					return todos;
				} catch (error) {
					console.error("Ошибка при получении списка задач:", error);
					throw new Error("Не удалось получить список задач");
				}
			},
		},

		get: {
			rest: {
				method: "GET",
				path: "/:id",
			},
			async handler(ctx) {
				const { id } = ctx.params;

				console.log(`Получен запрос на получение задачи с ID: ${id}`);

				// Проверяем, существует ли задача с данным ID
				const todo = await this.adapter.findById(id);
				if (!todo) {
					console.error(`Задача с ID ${id} не найдена`);
					throw new Error(`Задача с ID ${id} не найдена`);
				}

				console.log(`Задача с ID ${id} успешно получена`);

				return todo;
			},
		},

		update: {
			rest: {
				method: "PUT",
				path: "/:id",
			},
			async handler(ctx) {
				const { id } = ctx.params;

				console.log("Получен запрос на обновление для ID:", id);

				// Проверяем, существует ли задача с данным ID
				const existingTodo = await this.adapter.findById(id);
				if (!existingTodo) {
					console.error(`Задача с id ${id} не найдена`);
					throw new Error(`Задача с id ${id} не найдена`);
				}

				// Валидация данных
				if (ctx.params.title && ctx.params.title.trim().length < 3) {
					console.error(
						"Заголовок задачи не должен быть пустым и должен содержать не менее 3 символов",
					);
					throw new Error(
						"Заголовок задачи не должен быть пустым и должен содержать не менее 3 символов",
					);
				}

				// Подготавливаем объект обновлений в формате, ожидаемом адаптером
				const updates = {
					$set: {
						title:
							ctx.params.title !== undefined
								? ctx.params.title
								: existingTodo.title,
						description:
							ctx.params.description !== undefined
								? ctx.params.description
								: existingTodo.description,
						completed:
							ctx.params.completed !== undefined
								? ctx.params.completed
								: existingTodo.completed,
					},
				};

				try {
					const updatedTodo = await this.adapter.updateById(
						id,
						updates,
					);

					console.log(`Задача с ID ${id} успешно обновлена`);

					return updatedTodo;
				} catch (error) {
					console.error(
						"Ошибка при обновлении задачи через updateById:",
						error,
					);
					throw error;
				}
			},
		},

		remove: {
			rest: {
				method: "DELETE",
				path: "/:id",
			},
			async handler(ctx) {
				const { id } = ctx.params;

				console.log(`Получен запрос на удаление задачи с ID: ${id}`);

				try {
					// Проверяем, существует ли задача с данным ID
					const existingTodo = await this.adapter.findById(id);
					if (!existingTodo) {
						console.error(`Задача с ID ${id} не найдена`);
						throw new Error(`Задача с ID ${id} не найдена`);
					}

					const removedTodo = await this.adapter.removeById(id);

					console.log(`Задача с ID ${id} успешно удалена`);

					return removedTodo;
				} catch (error) {
					console.error(
						`Ошибка при удалении задачи с ID ${id}:`,
						error,
					);
					throw error.message.includes("не найдена")
						? error
						: new Error("Не удалось удалить задачу");
				}
			},
		},
	},
};
