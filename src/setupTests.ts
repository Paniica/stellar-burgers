import '@testing-library/jest-dom';

// Настройка для работы с CSS модулями в тестах
const mockCssModules = new Proxy({}, {
  get: function(target, name) {
    return name;
  }
});

// Мокаем CSS модули
Object.defineProperty(window, 'CSS', {
  value: {
    supports: () => false
  }
});

// Мокаем ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Мокаем IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Настройка для работы с localStorage в тестах
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
global.localStorage = localStorageMock as any;

// Настройка для работы с cookies в тестах
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
});

// Мокаем fetch для тестов
global.fetch = jest.fn();

// Настройка для работы с Redux DevTools
process.env.NODE_ENV = 'test';
