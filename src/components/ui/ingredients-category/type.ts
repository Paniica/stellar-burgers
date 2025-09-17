import { BurgerIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: BurgerIngredient[];
  ingredientsCounters: Record<string, number>;
};
