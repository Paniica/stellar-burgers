
export type BurgerIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

/**
 * Тип для ингредиентов в конструкторе с уникальным ID
 *
 * Расширяет BurgerIngredient дополнительным полем id для:
 * - Уникальной идентификации в списке конструктора
 * - Возможности перестановки элементов
 * - Удаления конкретного элемента из конструктора
 */
export type ConstructorItem = BurgerIngredient & {
  id: string;
};

/**
 * Тип для заказа пользователя
 *
 * Содержит информацию о заказе:
 * - Идентификатор и номер заказа
 * - Статус выполнения
 * - Список ID ингредиентов
 * - Временные метки создания и обновления
 */
export type OrderData = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

/**
 * Тип для ответа API с данными о заказах
 *
 * Включает:
 * - Массив заказов
 * - Общее количество заказов
 * - Количество заказов за сегодня
 */
export type OrdersResponse = {
  orders: OrderData[];
  total: number;
  totalToday: number;
};

/**
 * Тип для профиля пользователя
 *
 * Содержит основную информацию о пользователе:
 * - Email для аутентификации
 * - Имя для отображения в интерфейсе
 */
export type UserProfile = {
  email: string;
  name: string;
};


export type IngredientCategory = 'bun' | 'sauce' | 'main';


export type ConstructorState = {
  bun: ConstructorItem | null;
  ingredients: ConstructorItem[];
};
