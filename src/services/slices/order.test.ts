import orderReducer, {
  submitOrder,
  loadOrderByNumber,
  resetOrder,
  OrderState
} from './order';
import { OrderData } from '@utils-types';

/**
 * Тесты для редьюсера заказов
 * 
 * Проверяем обработку экшенов:
 * - Создание заказа (pending, fulfilled, rejected)
 * - Загрузка заказа по номеру (pending, fulfilled, rejected)
 * - Сброс состояния заказа
 */
describe('order reducer', () => {
  const initialState: OrderState = {
    orderRequest: false,
    orderData: null,
    lastError: null
  };

  // Моковые данные для тестов
  const mockOrder: OrderData = {
    _id: '64e3a7c936b6a4001c62fce9',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2023-08-18T10:00:00.000Z',
    updatedAt: '2023-08-18T10:00:00.000Z',
    number: 12345
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('submitOrder', () => {
    it('должен установить orderRequest в true при начале создания заказа', () => {
      const action = submitOrder.pending('', ['ingredient1', 'ingredient2']);
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderRequest).toBe(true);
      expect(newState.lastError).toBeNull();
      expect(newState.orderData).toBeNull();
    });

    it('должен установить данные заказа и orderRequest в false при успешном создании', () => {
      const action = submitOrder.fulfilled(mockOrder, '', ['ingredient1', 'ingredient2']);
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderRequest).toBe(false);
      expect(newState.lastError).toBeNull();
      expect(newState.orderData).toEqual(mockOrder);
    });

    it('должен установить ошибку и orderRequest в false при ошибке создания заказа', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = submitOrder.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        ['ingredient1', 'ingredient2']
      );
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderRequest).toBe(false);
      expect(newState.lastError).toBe(errorMessage);
      expect(newState.orderData).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = submitOrder.rejected(
        { name: 'Error' } as any,
        '',
        ['ingredient1', 'ingredient2']
      );
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderRequest).toBe(false);
      expect(newState.lastError).toBe('Ошибка при создании заказа');
      expect(newState.orderData).toBeNull();
    });

    it('должен очистить предыдущую ошибку при начале нового создания заказа', () => {
      const stateWithError: OrderState = {
        orderRequest: false,
        orderData: null,
        lastError: 'Предыдущая ошибка'
      };
      
      const action = submitOrder.pending('', ['ingredient1', 'ingredient2']);
      const newState = orderReducer(stateWithError, action);
      
      expect(newState.orderRequest).toBe(true);
      expect(newState.lastError).toBeNull();
    });

    it('должен заменить существующий заказ при создании нового', () => {
      const stateWithOrder: OrderState = {
        orderRequest: false,
        orderData: mockOrder,
        lastError: null
      };
      
      const newOrder: OrderData = {
        ...mockOrder,
        _id: 'new-order-id',
        number: 54321,
        name: 'Новый бургер'
      };
      
      const action = submitOrder.fulfilled(newOrder, '', ['ingredient1', 'ingredient2']);
      const newState = orderReducer(stateWithOrder, action);
      
      expect(newState.orderData).toEqual(newOrder);
      expect(newState.orderData).not.toEqual(mockOrder);
    });
  });

  describe('loadOrderByNumber', () => {
    it('должен очистить ошибку при начале загрузки заказа', () => {
      const stateWithError: OrderState = {
        orderRequest: false,
        orderData: null,
        lastError: 'Предыдущая ошибка'
      };
      
      const action = loadOrderByNumber.pending('', 12345);
      const newState = orderReducer(stateWithError, action);
      
      expect(newState.lastError).toBeNull();
      expect(newState.orderData).toBeNull();
    });

    it('должен установить данные заказа при успешной загрузке', () => {
      const action = loadOrderByNumber.fulfilled(mockOrder, '', 12345);
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderData).toEqual(mockOrder);
      expect(newState.lastError).toBeNull();
    });

    it('должен установить ошибку при ошибке загрузки заказа', () => {
      const errorMessage = 'Заказ не найден';
      const action = loadOrderByNumber.rejected(
        { message: errorMessage, name: 'Error' },
        '',
        12345
      );
      const newState = orderReducer(initialState, action);
      
      expect(newState.lastError).toBe(errorMessage);
      expect(newState.orderData).toBeNull();
    });

    it('должен использовать сообщение по умолчанию при отсутствии сообщения об ошибке', () => {
      const action = loadOrderByNumber.rejected(
        { name: 'Error' } as any,
        '',
        12345
      );
      const newState = orderReducer(initialState, action);
      
      expect(newState.lastError).toBe('Ошибка при загрузке заказа');
      expect(newState.orderData).toBeNull();
    });

    it('должен заменить существующий заказ при загрузке нового', () => {
      const stateWithOrder: OrderState = {
        orderRequest: false,
        orderData: mockOrder,
        lastError: null
      };
      
      const newOrder: OrderData = {
        ...mockOrder,
        _id: 'different-order-id',
        number: 67890,
        name: 'Другой бургер'
      };
      
      const action = loadOrderByNumber.fulfilled(newOrder, '', 67890);
      const newState = orderReducer(stateWithOrder, action);
      
      expect(newState.orderData).toEqual(newOrder);
      expect(newState.orderData).not.toEqual(mockOrder);
    });
  });

  describe('resetOrder', () => {
    it('должен очистить данные заказа и ошибку', () => {
      const stateWithOrderAndError: OrderState = {
        orderRequest: false,
        orderData: mockOrder,
        lastError: 'Какая-то ошибка'
      };
      
      const action = resetOrder();
      const newState = orderReducer(stateWithOrderAndError, action);
      
      expect(newState.orderData).toBeNull();
      expect(newState.lastError).toBeNull();
      expect(newState.orderRequest).toBe(false);
    });

    it('должен очистить пустое состояние без ошибок', () => {
      const action = resetOrder();
      const newState = orderReducer(initialState, action);
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('комбинированные сценарии', () => {
    it('должен корректно обрабатывать последовательность: создание заказа -> успех -> сброс -> загрузка заказа', () => {
      let state = initialState;
      
      // Создание заказа
      state = orderReducer(state, submitOrder.pending('', ['ingredient1', 'ingredient2']));
      expect(state.orderRequest).toBe(true);
      expect(state.lastError).toBeNull();
      
      // Успешное создание
      state = orderReducer(state, submitOrder.fulfilled(mockOrder, '', ['ingredient1', 'ingredient2']));
      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      
      // Сброс
      state = orderReducer(state, resetOrder());
      expect(state.orderData).toBeNull();
      expect(state.lastError).toBeNull();
      
      // Загрузка заказа
      const newOrder: OrderData = {
        ...mockOrder,
        _id: 'loaded-order-id',
        number: 99999
      };
      state = orderReducer(state, loadOrderByNumber.fulfilled(newOrder, '', 99999));
      expect(state.orderData).toEqual(newOrder);
    });

    it('должен корректно обрабатывать ошибки в разных операциях', () => {
      let state = initialState;
      
      // Ошибка создания заказа
      state = orderReducer(state, submitOrder.rejected(
        { message: 'Ошибка создания', name: 'Error' },
        '',
        ['ingredient1']
      ));
      expect(state.lastError).toBe('Ошибка создания');
      
      // Ошибка загрузки заказа (должна заменить предыдущую ошибку)
      state = orderReducer(state, loadOrderByNumber.rejected(
        { message: 'Ошибка загрузки', name: 'Error' },
        '',
        12345
      ));
      expect(state.lastError).toBe('Ошибка загрузки');
    });
  });
});

