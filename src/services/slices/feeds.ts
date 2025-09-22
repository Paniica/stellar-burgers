import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { OrderData, OrdersResponse } from '@utils-types';

// Состояние для ленты заказов и истории пользователя
export type FeedsState = {
  feed: OrdersResponse | null;
  orders: OrderData[];
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedsState = {
  feed: null,
  orders: [],
  isLoading: false,
  error: null
};

// Загрузка общей ленты заказов
export const loadFeed = createAsyncThunk('feeds/loadFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

// Загрузка заказов пользователя
export const loadUserOrders = createAsyncThunk(
  'feeds/loadUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadFeed.fulfilled,
        (state, action: PayloadAction<OrdersResponse>) => {
          state.isLoading = false;
          state.feed = action.payload;
        }
      )
      .addCase(loadFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(loadUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadUserOrders.fulfilled,
        (state, action: PayloadAction<OrderData[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(loadUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export default feedsSlice.reducer;
