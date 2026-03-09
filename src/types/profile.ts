export interface ProfileOrder {
  id: string;
  product: string;
  image: string;
  date: string;
  amount: number;
  status: "done" | "shipping" | "pending";
  badge: string;
  badgeColor: string;
}

export interface ProfileReview {
  product: string;
  rating: number;
  date: string;
  content: string;
}

export interface ProfileStat {
  label: string;
  value: string;
  color: string;
}
