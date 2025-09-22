import { Location } from 'react-router-dom';
import { BurgerIngredient } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: BurgerIngredient;
  count: number;
  locationState: { background: Location };
  handleAdd: () => void;
};
