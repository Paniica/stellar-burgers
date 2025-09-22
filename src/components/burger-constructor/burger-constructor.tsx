import { FC, useMemo } from 'react';
import { ConstructorItem } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '@selectors/constructor';
import { selectOrderRequest, selectOrderData } from '@selectors/order';
import { resetConstructor } from '@slices/constructor';
import { submitOrder, resetOrder } from '@slices/order';
import { selectUser } from '@selectors/user';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент конструктора бургера - сердце приложения Stellar Burgers
 *
 * Основные функции:
 * - Отображение текущего состояния конструктора (булка + начинки)
 * - Расчет общей стоимости заказа с учетом удвоенной цены булки
 * - Обработка создания заказа с проверкой авторизации
 * - Управление модальными окнами для подтверждения заказа
 *
 * Бизнес-логика:
 * - Булка учитывается дважды в цене (верх + низ)
 * - Заказ можно создать только авторизованному пользователю
 * - После успешного заказа конструктор очищается
 * - Предотвращение повторных заказов во время обработки
 */
export const BurgerConstructor: FC = () => {
  // Получаем необходимые данные из Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  const handleOrderSubmit = () => {
    // Проверяем авторизацию пользователя
    if (!user) {
      navigate('/login');
      return;
    }
    // Проверяем наличие булки и отсутствие активного запроса
    if (!constructorItems.bun || orderRequest) return;
    // Формируем массив ID ингредиентов для заказа
    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(submitOrder(ingredientIds));
  };

  const handleOrderModalClose = () => {
    // Очищаем конструктор после успешного заказа
    if (orderModalData) {
      dispatch(resetConstructor());
      dispatch(resetOrder());
    }
  };

  const totalPrice = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: ConstructorItem) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderSubmit}
      closeOrderModal={handleOrderModalClose}
    />
  );
};
