import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { OrderData } from '@utils-types';

// Состояние для управления заказами
export type OrderState = {
  orderRequest: boolean;
  orderData: OrderData | null;
  lastError: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderData: null,
  lastError: null
};

// Создание нового заказа
export const submitOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

// Получение заказа по номеру
export const loadOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.orderData = null;
      state.lastError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.orderRequest = true;
        state.lastError = null;
      })
      .addCase(
        submitOrder.fulfilled,
        (state, action: PayloadAction<OrderData>) => {
          state.orderRequest = false;
          state.orderData = action.payload;
        }
      )
      .addCase(submitOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.lastError = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(loadOrderByNumber.pending, (state) => {
        state.lastError = null;
      })
      .addCase(
        loadOrderByNumber.fulfilled,
        (state, action: PayloadAction<OrderData>) => {
          state.orderData = action.payload;
        }
      )
      .addCase(loadOrderByNumber.rejected, (state, action) => {
        state.lastError = action.error.message || 'Ошибка при загрузке заказа';
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
