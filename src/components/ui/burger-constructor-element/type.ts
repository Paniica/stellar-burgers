import { ConstructorItem } from '@utils-types';

export type BurgerConstructorElementUIProps = {
  ingredient: ConstructorItem;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};
