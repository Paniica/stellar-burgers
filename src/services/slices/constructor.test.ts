import constructorReducer, {
  addConstructorItem,
  removeConstructorItem,
  reorderIngredients,
  resetConstructor,
  ConstructorState
} from './constructor';
import { BurgerIngredient } from '@utils-types';

/**
 * Тесты для редьюсера конструктора бургера
 * 
 * Проверяем обработку экшенов:
 * - Добавление ингредиента (булка и начинка)
 * - Удаление ингредиента
 * - Изменение порядка ингредиентов
 * - Очистка конструктора
 */
describe('constructor reducer', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  // Моковые данные для тестов
  const mockBun: BurgerIngredient = {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png'
  };

  const mockMain: BurgerIngredient = {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 4242,
    image: 'https://example.com/meat.png',
    image_mobile: 'https://example.com/meat-mobile.png',
    image_large: 'https://example.com/meat-large.png'
  };

  const mockSauce: BurgerIngredient = {
    _id: '3',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png'
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addConstructorItem', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addConstructorItem({ ingredient: mockBun });
      const newState = constructorReducer(initialState, action);
      
      expect(newState.bun).toEqual({
        ...mockBun,
        id: expect.any(String) // Проверяем, что добавился уникальный ID
      });
      expect(newState.ingredients).toEqual([]);
    });

    it('должен заменить существующую булку новой', () => {
      const firstBun = { ...mockBun, _id: '1' };
      const secondBun = { ...mockBun, _id: '2', name: 'Новая булка' };
      
      const stateWithBun = constructorReducer(initialState, addConstructorItem({ ingredient: firstBun }));
      const newState = constructorReducer(stateWithBun, addConstructorItem({ ingredient: secondBun }));
      
      expect(newState.bun).toEqual({
        ...secondBun,
        id: expect.any(String)
      });
      expect(newState.bun?.name).toBe('Новая булка');
    });

    it('должен добавить начинку в список ингредиентов', () => {
      const action = addConstructorItem({ ingredient: mockMain });
      const newState = constructorReducer(initialState, action);
      
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual({
        ...mockMain,
        id: expect.any(String)
      });
    });

    it('должен добавить соус в список ингредиентов', () => {
      const action = addConstructorItem({ ingredient: mockSauce });
      const newState = constructorReducer(initialState, action);
      
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual({
        ...mockSauce,
        id: expect.any(String)
      });
    });

    it('должен добавить несколько ингредиентов в список', () => {
      const stateWithMain = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      const newState = constructorReducer(stateWithMain, addConstructorItem({ ingredient: mockSauce }));
      
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
      expect(newState.ingredients[1].name).toBe('Соус Spicy-X');
    });
  });

  describe('removeConstructorItem', () => {
    it('должен удалить ингредиент из списка по ID', () => {
      const stateWithIngredients = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      const stateWithTwoIngredients = constructorReducer(stateWithIngredients, addConstructorItem({ ingredient: mockSauce }));
      
      const firstIngredientId = stateWithTwoIngredients.ingredients[0].id;
      const action = removeConstructorItem({ id: firstIngredientId });
      const newState = constructorReducer(stateWithTwoIngredients, action);
      
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
    });

    it('должен не изменить состояние при попытке удалить несуществующий ингредиент', () => {
      const stateWithIngredients = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      const action = removeConstructorItem({ id: 'non-existent-id' });
      const newState = constructorReducer(stateWithIngredients, action);
      
      expect(newState).toEqual(stateWithIngredients);
    });

    it('должен не удалить булку при попытке удалить по ID начинки', () => {
      const stateWithBun = constructorReducer(initialState, addConstructorItem({ ingredient: mockBun }));
      const stateWithBunAndMain = constructorReducer(stateWithBun, addConstructorItem({ ingredient: mockMain }));
      
      const mainIngredientId = stateWithBunAndMain.ingredients[0].id;
      const action = removeConstructorItem({ id: mainIngredientId });
      const newState = constructorReducer(stateWithBunAndMain, action);
      
      expect(newState.bun).not.toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('reorderIngredients', () => {
    it('должен изменить порядок ингредиентов в списке', () => {
      // Добавляем три ингредиента
      let state = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      state = constructorReducer(state, addConstructorItem({ ingredient: mockSauce }));
      state = constructorReducer(state, addConstructorItem({ ingredient: { ...mockMain, _id: '4', name: 'Другой ингредиент' } }));
      
      // Перемещаем первый ингредиент в конец
      const action = reorderIngredients({ fromIndex: 0, toIndex: 2 });
      const newState = constructorReducer(state, action);
      
      expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
      expect(newState.ingredients[1].name).toBe('Другой ингредиент');
      expect(newState.ingredients[2].name).toBe('Биокотлета из марсианской Магнолии');
    });

    it('должен не изменить состояние при попытке переместить ингредиент на тот же индекс', () => {
      const stateWithIngredients = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      const stateWithTwoIngredients = constructorReducer(stateWithIngredients, addConstructorItem({ ingredient: mockSauce }));
      
      const action = reorderIngredients({ fromIndex: 0, toIndex: 0 });
      const newState = constructorReducer(stateWithTwoIngredients, action);
      
      expect(newState).toEqual(stateWithTwoIngredients);
    });

    it('должен корректно обрабатывать перемещение в начало списка', () => {
      // Добавляем два ингредиента
      let state = constructorReducer(initialState, addConstructorItem({ ingredient: mockMain }));
      state = constructorReducer(state, addConstructorItem({ ingredient: mockSauce }));
      
      // Перемещаем второй ингредиент в начало
      const action = reorderIngredients({ fromIndex: 1, toIndex: 0 });
      const newState = constructorReducer(state, action);
      
      expect(newState.ingredients[0].name).toBe('Соус Spicy-X');
      expect(newState.ingredients[1].name).toBe('Биокотлета из марсианской Магнолии');
    });
  });

  describe('resetConstructor', () => {
    it('должен очистить весь конструктор', () => {
      // Добавляем булку и ингредиенты
      let state = constructorReducer(initialState, addConstructorItem({ ingredient: mockBun }));
      state = constructorReducer(state, addConstructorItem({ ingredient: mockMain }));
      state = constructorReducer(state, addConstructorItem({ ingredient: mockSauce }));
      
      // Очищаем конструктор
      const action = resetConstructor();
      const newState = constructorReducer(state, action);
      
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual([]);
    });

    it('должен очистить пустой конструктор без ошибок', () => {
      const action = resetConstructor();
      const newState = constructorReducer(initialState, action);
      
      expect(newState).toEqual(initialState);
    });
  });
});




