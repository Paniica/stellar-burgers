import { OrderData, ConstructorState } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: OrderData | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
