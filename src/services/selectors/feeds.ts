import { RootState } from '../store';

// Селекторы для работы с лентой заказов
export const selectFeed = (state: RootState) => state.feeds.feed;
export const selectOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
