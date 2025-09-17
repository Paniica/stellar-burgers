import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadUserOrders } from '@slices/feeds';
import { selectOrders, selectFeedsLoading } from '@selectors/feeds';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectFeedsLoading);

  useEffect(() => {
    dispatch(loadUserOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
