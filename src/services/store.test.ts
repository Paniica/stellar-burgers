import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredients';
import constructorSlice from './slices/constructor';
import orderSlice from './slices/order';
import feedsSlice from './slices/feeds';
import userSlice from './slices/user';

/**
 * Тесты для rootReducer
 * 
 * Проверяем правильную настройку и работу корневого редьюсера:
 * - Инициализация с undefined состоянием
 * - Обработка неизвестных экшенов
 * - Возврат корректного начального состояния
 */
describe('rootReducer', () => {
  const rootReducer = combineReducers({
    ingredients: ingredientsSlice,
    burgerConstructor: constructorSlice,
    order: orderSlice,
    feeds: feedsSlice,
    user: userSlice
  });

  it('должен возвращать корректное начальное состояние при инициализации с undefined', () => {
    // Вызываем rootReducer с undefined состоянием и неизвестным экшеном
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем, что возвращается корректное начальное состояние
    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderData: null,
        lastError: null
      },
      feeds: {
        feed: null,
        orders: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      }
    });
  });

  it('должен обрабатывать неизвестные экшены без изменения состояния', () => {
    // Получаем начальное состояние
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Диспатчим другой неизвестный экшен
    const newState = rootReducer(initialState, { type: 'ANOTHER_UNKNOWN_ACTION' });
    
    // Проверяем, что состояние не изменилось
    expect(newState).toEqual(initialState);
  });

  it('должен содержать все необходимые слайсы', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем наличие всех слайсов
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('user');
  });

  it('должен иметь правильную структуру каждого слайса', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Проверяем структуру слайса ingredients
    expect(state.ingredients).toHaveProperty('items');
    expect(state.ingredients).toHaveProperty('isLoading');
    expect(state.ingredients).toHaveProperty('error');
    
    // Проверяем структуру слайса burgerConstructor
    expect(state.burgerConstructor).toHaveProperty('bun');
    expect(state.burgerConstructor).toHaveProperty('ingredients');
    
    // Проверяем структуру слайса order
    expect(state.order).toHaveProperty('orderRequest');
    expect(state.order).toHaveProperty('orderData');
    expect(state.order).toHaveProperty('lastError');
    
    // Проверяем структуру слайса feeds
    expect(state.feeds).toHaveProperty('feed');
    expect(state.feeds).toHaveProperty('orders');
    expect(state.feeds).toHaveProperty('isLoading');
    expect(state.feeds).toHaveProperty('error');
    
    // Проверяем структуру слайса user
    expect(state.user).toHaveProperty('user');
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('isLoading');
    expect(state.user).toHaveProperty('error');
  });
});