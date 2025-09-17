import { RootState } from '../store';

// Селектор для получения элементов конструктора
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
