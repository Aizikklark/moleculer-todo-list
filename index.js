const { ServiceBroker } = require("moleculer");

// Создание брокера сервиса
const broker = new ServiceBroker({
    nodeID: "node-1", // Уникальный идентификатор узла
    transporter: "tcp" // Используем tcp в качестве транспорта 
});

// Регистрируем сервисы
broker.createService(require("./services/todo.service")); // Сервис для работы с задачами
broker.createService(require("./services/api.service"));  // API сервис

// Запуск брокера
broker.start()
    .then(() => {
        console.log("Брокер запущен!");
    })
    .catch(err => {
        console.error("Ошибка при запуске брокера:", err);
    });
