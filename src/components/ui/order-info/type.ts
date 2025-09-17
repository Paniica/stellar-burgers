import { BurgerIngredient } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
};

type TOrderInfo = {
  ingredientsInfo: {
    [key: string]: BurgerIngredient & { count: number };
  };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
