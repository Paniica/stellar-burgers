import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Импортируем все слайсы состояния для централизованного управления
import ingredientsSlice from './slices/ingredients';
import constructorSlice from './slices/constructor';
import orderSlice from './slices/order';
import feedsSlice from './slices/feeds';
import userSlice from './slices/user';

/**
 * Централизованное хранилище состояния приложения Stellar Burgers
 *
 * Архитектура Redux store:
 * - ingredients: управление данными ингредиентов бургера
 * - burgerConstructor: состояние конструктора бургера (булка + начинки)
 * - order: обработка заказов и их статусов
 * - feeds: лента заказов и история пользователя
 * - user: аутентификация и профиль пользователя
 *
 * Преимущества такой структуры:
 * - Модульность: каждый слайс отвечает за свою область
 * - Типизация: полная поддержка TypeScript
 * - Производительность: оптимизированные селекторы
 * - Отладка: Redux DevTools в development режиме
 */

// Объединяем все редьюсеры в единое корневое состояние
const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  burgerConstructor: constructorSlice,
  order: orderSlice,
  feeds: feedsSlice,
  user: userSlice
});

// Создаем store с оптимальными настройками для production и development
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production' // Включаем DevTools только в development
});

// Экспортируем типы для TypeScript интеграции
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

/**
 * Типизированные хуки для работы с Redux store
 *
 * Эти хуки обеспечивают:
 * - Полную типизацию при использовании useSelector и useDispatch
 * - Автокомплит для селекторов и действий
 * - Безопасность типов на этапе компиляции
 */
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
