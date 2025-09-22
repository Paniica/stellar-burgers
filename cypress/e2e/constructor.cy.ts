/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Настраиваем моки API запросов
    cy.mockApiRequests();
    
    // Переходим на главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Скрываем webpack overlay
    cy.window().then((win) => {
      const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.zIndex = '-1';
      }
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим булку в списке ингредиентов и кликаем на кнопку "Добавить"
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      // Проверяем, что булка добавилась в конструктор
      cy.get('[data-testid="constructor-bun-top"]').should('contain.text', 'Краторная булка N-200i');
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain.text', 'Краторная булка N-200i');
    });

    it('должен добавить начинку в конструктор', () => {
      // Находим начинку в списке ингредиентов и кликаем на кнопку "Добавить"
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      // Проверяем, что начинка добавилась в конструктор
      cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    it('должен добавить соус в конструктор', () => {
      // Находим соус в списке ингредиентов и кликаем на кнопку "Добавить"
      cy.get('[data-testid="ingredient-sauce"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      // Проверяем, что соус добавился в конструктор
      cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Соус Spicy-X');
    });
  });

  describe('Модальные окна', () => {
    it('должен открыть модальное окно с деталями ингредиента', () => {
      // Кликаем на ссылку ингредиента (это откроет модальное окно через роутинг)
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('a').click({ force: true });
      });
      
      // Проверяем, что мы перешли на страницу ингредиента
      cy.url().should('include', '/ingredients/');
      
      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('contain.text', 'Детали ингредиента');
      cy.get('[data-testid="modal"]').should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    it('должен закрыть модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('a').click({ force: true });
      });
      cy.url().should('include', '/ingredients/');
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Закрываем модальное окно по клику на крестик
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен закрыть модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('a').click({ force: true });
      });
      cy.url().should('include', '/ingredients/');
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Закрываем модальное окно по клику на оверлей
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем токены авторизации
      cy.setAuthTokens('test-access-token', 'test-refresh-token');
      
      // Добавляем ингредиенты в конструктор
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
      
      cy.get('[data-testid="ingredient-sauce"]').first().within(() => {
        cy.get('button').click({ force: true });
      });
    });

    it('должен создать заказ и показать модальное окно с номером заказа', () => {
      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-testid="order-button"]').click();
      
      // Ждем запроса на создание заказа
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно с заказом открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('contain.text', '12345');
    });

    it('должен закрыть модальное окно заказа', () => {
      // Создаем заказ
      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Закрываем модальное окно
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Очистка токенов после тестов', () => {
    afterEach(() => {
      // Очищаем токены авторизации после каждого теста
      cy.clearAuthTokens();
    });
  });
});




