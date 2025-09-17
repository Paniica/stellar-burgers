import { RootState } from '../store';

// Селекторы для работы с ингредиентами
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id) || null;
