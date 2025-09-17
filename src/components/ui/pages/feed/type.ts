import { OrderData } from '@utils-types';

export type FeedUIProps = {
  orders: OrderData[];
  handleGetFeeds: () => void;
};
