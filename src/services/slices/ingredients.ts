import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { BurgerIngredient } from '@utils-types';

// Состояние для управления ингредиентами
export type IngredientsState = {
  items: BurgerIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

// Асинхронное действие для загрузки ингредиентов
export const loadIngredients = createAsyncThunk(
  'ingredients/loadAll',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Установка ингредиентов вручную
    setIngredientsList(state, action: PayloadAction<BurgerIngredient[]>) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadIngredients.fulfilled,
        (state, action: PayloadAction<BurgerIngredient[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
      });
  }
});

export const { setIngredientsList } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
