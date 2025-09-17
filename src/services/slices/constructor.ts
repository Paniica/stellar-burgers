import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConstructorItem, BurgerIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Состояние конструктора бургера
export type ConstructorState = {
  bun: ConstructorItem | null;
  ingredients: ConstructorItem[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addConstructorItem: {
      reducer(state, action: PayloadAction<{ ingredient: ConstructorItem }>) {
        const { ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare(payload: { ingredient: BurgerIngredient }) {
        const { ingredient } = payload;
        return {
          payload: {
            ingredient: { ...ingredient, id: uuidv4() }
          }
        };
      }
    },
    // Удаление ингредиента из конструктора
    removeConstructorItem(state, action: PayloadAction<{ id: string }>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    // Перемещение ингредиентов в конструкторе
    reorderIngredients(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.ingredients];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.ingredients = items;
    },
    // Очистка всего конструктора
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addConstructorItem,
  removeConstructorItem,
  reorderIngredients,
  resetConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
