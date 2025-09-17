import { FC } from 'react';

import { OrderData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed } from '@selectors/feeds';

const getOrders = (orders: OrderData[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Достаю из стора агрегированные данные ленты и беру список заказов
  const feed = useSelector(selectFeed);
  const orders: OrderData[] = feed?.orders || [];

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed || { orders: [], total: 0, totalToday: 0 }}
    />
  );
};
