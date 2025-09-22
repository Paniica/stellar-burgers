// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Настройка для работы с localStorage и cookies
beforeEach(() => {
  // Очищаем localStorage перед каждым тестом
  cy.clearLocalStorage();
  
  // Очищаем cookies перед каждым тестом
  cy.clearCookies();
});

// Настройка для работы с модальными окнами
Cypress.on('uncaught:exception', (err, runnable) => {
  // Игнорируем ошибки, связанные с модальными окнами
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});




