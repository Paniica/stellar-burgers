import { BurgerIngredient } from '@utils-types';

export type TIngredientsCategoryProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: BurgerIngredient[];
};
