const { ServiceBroker } = require("moleculer");
const TodoService = require("../services/todo.service");

// Установка таймаута для тестов
jest.setTimeout(30000); 

// Создаем брокер для тестов
const broker = new ServiceBroker({
  nodeID: "test-node",
  logger: false // Отключаем логгирование для тестов
});

// Создаем сервис
const service = broker.createService(TodoService);

// Создаем моки для методов адаптера
const mockInsert = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockUpdateById = jest.fn();
const mockRemoveById = jest.fn();

// Подменяем методы адаптера в нашем сервисе
service.adapter.insert = mockInsert;
service.adapter.find = mockFind;
service.adapter.findById = mockFindById;
service.adapter.updateById = mockUpdateById;
service.adapter.removeById = mockRemoveById;

describe("Тесты сервиса 'todos' с моками", () => {
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  let todoId = 1;

  beforeEach(() => {
    // Обновляем моки перед каждым тестом
    mockInsert.mockClear();
    mockFind.mockClear();
    mockFindById.mockClear();
    mockUpdateById.mockClear();
    mockRemoveById.mockClear();
  });

  it("создает задачу", async () => {
    const newTodo = { id: todoId, title: "Новая задача", description: "Описание новой задачи", completed: false };
    mockInsert.mockResolvedValue(newTodo);

    const result = await broker.call("todos.create", {
      title: "Новая задача",
      description: "Описание новой задачи"
    });

    expect(result).toEqual(newTodo);
    expect(mockInsert).toHaveBeenCalledWith({
      title: "Новая задача",
      description: "Описание новой задачи",
      completed: false
    });
  });

  it("получает список задач", async () => {
    const todosList = [{ id: todoId, title: "Новая задача", description: "Описание новой задачи", completed: false }];
    mockFind.mockResolvedValue(todosList);

    const result = await broker.call("todos.list");

    expect(result).toEqual(todosList);
    expect(mockFind).toHaveBeenCalled();
  });

  it("получает задачу по ID", async () => {
    const todo = { id: todoId, title: "Новая задача", description: "Описание новой задачи", completed: false };
    mockFindById.mockResolvedValue(todo);

    const result = await broker.call("todos.get", { id: todoId });

    expect(result).toEqual(todo);
    expect(mockFindById).toHaveBeenCalledWith(todoId);
  });

  it("обновляет задачу", async () => {
    const updatedTodo = { id: todoId, title: "Обновленная задача", description: "Описание новой задачи", completed: false };
    mockUpdateById.mockResolvedValue(updatedTodo);
  
    const result = await broker.call("todos.update", {
      id: todoId,
      title: "Обновленная задача"
    });
  
    expect(result).toEqual(updatedTodo);
    expect(mockUpdateById).toHaveBeenCalledWith(todoId, {
      $set: {
        title: "Обновленная задача",
        description: "Описание новой задачи",
        completed: false
      }
    });
  });
  
  it("удаляет задачу", async () => {
    const removedTodo = { id: todoId, title: "Новая задача", description: "Описание новой задачи", completed: false };
    mockRemoveById.mockResolvedValue(removedTodo);

    const result = await broker.call("todos.remove", { id: todoId });

    expect(result).toEqual(removedTodo);
    expect(mockRemoveById).toHaveBeenCalledWith(todoId);
  });

  it("ошибка при получении удаленной задачи", async () => {
    mockFindById.mockResolvedValue(null);
  
    await expect(broker.call("todos.get", { id: todoId })).rejects.toThrow(/Задача с ID \d+ не найдена/);
    expect(mockFindById).toHaveBeenCalledWith(todoId);
  });  
});
