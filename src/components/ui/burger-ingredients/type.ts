import { RefObject } from 'react';
import { BurgerIngredient, IngredientCategory } from '@utils-types';

export type BurgerIngredientsUIProps = {
  currentTab: IngredientCategory;
  buns: BurgerIngredient[];
  mains: BurgerIngredient[];
  sauces: BurgerIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: (node?: Element | null | undefined) => void;
  mainsRef: (node?: Element | null | undefined) => void;
  saucesRef: (node?: Element | null | undefined) => void;
  onTabClick: (val: string) => void;
};
