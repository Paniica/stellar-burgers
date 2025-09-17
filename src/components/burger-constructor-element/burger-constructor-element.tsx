import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { reorderIngredients, removeConstructorItem } from '@slices/constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Перемещение ингредиента вниз
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(reorderIngredients({ fromIndex: index, toIndex: index + 1 }));
      }
    };

    // Перемещение ингредиента вверх
    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(reorderIngredients({ fromIndex: index, toIndex: index - 1 }));
      }
    };

    // Удаление ингредиента из конструктора
    const handleClose = () => {
      dispatch(removeConstructorItem({ id: ingredient.id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
