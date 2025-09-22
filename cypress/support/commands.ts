/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Устанавливает токены авторизации в localStorage и cookies
       * @param accessToken - токен доступа
       * @param refreshToken - токен обновления
       */
      setAuthTokens(accessToken: string, refreshToken: string): Chainable<void>;
      
      /**
       * Очищает токены авторизации
       */
      clearAuthTokens(): Chainable<void>;
      
      /**
       * Перехватывает API запросы с моковыми данными
       */
      mockApiRequests(): Chainable<void>;
    }
  }
}

// Команда для установки токенов авторизации
Cypress.Commands.add('setAuthTokens', (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  cy.setCookie('accessToken', accessToken);
});

// Команда для очистки токенов авторизации
Cypress.Commands.add('clearAuthTokens', () => {
  localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

// Команда для настройки моков API запросов
Cypress.Commands.add('mockApiRequests', () => {
  // Перехватываем запрос на получение ингредиентов
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  
  // Перехватываем запрос на получение данных пользователя
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
  
  // Перехватываем запрос на создание заказа
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
});




