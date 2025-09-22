import feedsReducer, {
  loadFeed,
  loadUserOrders,
  FeedsState
} from './feeds';
import { OrderData } from '@utils-types';

/**
 * Тесты для редьюсера ленты заказов
 * 
 * Проверяем обработку экшенов:
 * - Загрузка общей ленты заказов (pending, fulfilled, rejected)
 * - Загрузка заказов пользователя (pending, fulfilled, rejected)
 */
describe('feeds reducer', () => {
  const initialState: FeedsState = {
    feed: null,
    orders: [],
    isLoading: false,
    error: null
  };

  // Моковые данные для тестов
  const mockOrders: OrderData[] = [
    {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2023-08-18T10:00:00.000Z',
      updatedAt: '2023-08-18T10:00:00.000Z',
      number: 12345
    },
    {
      _id: '2',
      ingredients: ['ingredient3', 'ingredient4'],
      status: 'pending',
      name: 'Бургер 2',
      createdAt: '2023-08-18T11:00:00.000Z',
      updatedAt: '2023-08-18T11:00:00.000Z',
      number: 12346
    }
  ];

  const mockFeed = {
    success: true,
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  it('должен возвращать начальное состояние', () => {
    expect(feedsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('loadFeed', () => {
    it('должен установить isLoading в true при начале загрузки ленты', () => {
      const action = loadFeed.pending('', undefined);
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.feed).toBeNull();
    });

    it('должен установить данные ленты и isLoading в false при успешной загрузке', () => {
      const action = loadFeed.fulfilled(mockFeed, '', undefined);
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.feed).toEqual(mockFeed);
    });

    it('должен установить ошибку и isLoading в false при ошибке загрузки ленты', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = loadFeed.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        undefined
      );
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.feed).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = loadFeed.rejected(
        { name: 'Error' } as any,
        '',
        undefined
      );
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки ленты');
      expect(newState.feed).toBeNull();
    });

    it('должен очистить предыдущую ошибку при начале новой загрузки', () => {
      const stateWithError: FeedsState = {
        feed: null,
        orders: [],
        isLoading: false,
        error: 'Предыдущая ошибка'
      };
      
      const action = loadFeed.pending('', undefined);
      const newState = feedsReducer(stateWithError, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен заменить существующие данные ленты при новой загрузке', () => {
      const stateWithFeed: FeedsState = {
        feed: mockFeed,
        orders: [],
        isLoading: false,
        error: null
      };
      
      const newFeed = {
        success: true,
        orders: [mockOrders[0]], // Только один заказ
        total: 50,
        totalToday: 5
      };
      
      const action = loadFeed.fulfilled(newFeed, '', undefined);
      const newState = feedsReducer(stateWithFeed, action);
      
      expect(newState.feed).toEqual(newFeed);
      expect(newState.feed).not.toEqual(mockFeed);
    });
  });

  describe('loadUserOrders', () => {
    it('должен установить isLoading в true при начале загрузки заказов пользователя', () => {
      const action = loadUserOrders.pending('', undefined);
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual([]);
    });

    it('должен установить заказы пользователя и isLoading в false при успешной загрузке', () => {
      const action = loadUserOrders.fulfilled(mockOrders, '', undefined);
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual(mockOrders);
    });

    it('должен установить ошибку и isLoading в false при ошибке загрузки заказов пользователя', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = loadUserOrders.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        undefined
      );
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.orders).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = loadUserOrders.rejected(
        { name: 'Error' } as any,
        '',
        undefined
      );
      const newState = feedsReducer(initialState, action);
      
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки заказов');
      expect(newState.orders).toEqual([]);
    });

    it('должен очистить предыдущую ошибку при начале новой загрузки', () => {
      const stateWithError: FeedsState = {
        feed: null,
        orders: [],
        isLoading: false,
        error: 'Предыдущая ошибка'
      };
      
      const action = loadUserOrders.pending('', undefined);
      const newState = feedsReducer(stateWithError, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен заменить существующие заказы пользователя при новой загрузке', () => {
      const stateWithOrders: FeedsState = {
        feed: null,
        orders: mockOrders,
        isLoading: false,
        error: null
      };
      
      const newOrders: OrderData[] = [mockOrders[0]]; // Только один заказ
      
      const action = loadUserOrders.fulfilled(newOrders, '', undefined);
      const newState = feedsReducer(stateWithOrders, action);
      
      expect(newState.orders).toEqual(newOrders);
      expect(newState.orders).not.toEqual(mockOrders);
    });
  });

  describe('комбинированные сценарии', () => {
    it('должен корректно обрабатывать последовательность: загрузка ленты -> загрузка заказов пользователя', () => {
      let state = initialState;
      
      // Загрузка ленты
      state = feedsReducer(state, loadFeed.pending('', undefined));
      expect(state.isLoading).toBe(true);
      
      state = feedsReducer(state, loadFeed.fulfilled(mockFeed, '', undefined));
      expect(state.feed).toEqual(mockFeed);
      expect(state.isLoading).toBe(false);
      
      // Загрузка заказов пользователя
      state = feedsReducer(state, loadUserOrders.pending('', undefined));
      expect(state.isLoading).toBe(true);
      
      state = feedsReducer(state, loadUserOrders.fulfilled(mockOrders, '', undefined));
      expect(state.orders).toEqual(mockOrders);
      expect(state.isLoading).toBe(false);
    });

    it('должен корректно обрабатывать ошибки в разных операциях', () => {
      let state = initialState;
      
      // Ошибка загрузки ленты
      state = feedsReducer(state, loadFeed.rejected(
        { message: 'Ошибка ленты', name: 'Error' },
        '',
        undefined
      ));
      expect(state.error).toBe('Ошибка ленты');
      
      // Ошибка загрузки заказов пользователя (должна заменить предыдущую ошибку)
      state = feedsReducer(state, loadUserOrders.rejected(
        { message: 'Ошибка заказов', name: 'Error' },
        '',
        undefined
      ));
      expect(state.error).toBe('Ошибка заказов');
    });

    it('должен независимо обрабатывать ленту и заказы пользователя', () => {
      let state = initialState;
      
      // Загружаем ленту
      state = feedsReducer(state, loadFeed.fulfilled(mockFeed, '', undefined));
      expect(state.feed).toEqual(mockFeed);
      expect(state.orders).toEqual([]);
      
      // Загружаем заказы пользователя
      state = feedsReducer(state, loadUserOrders.fulfilled(mockOrders, '', undefined));
      expect(state.feed).toEqual(mockFeed); // Лента не изменилась
      expect(state.orders).toEqual(mockOrders);
    });
  });
});