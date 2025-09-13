export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  primary?: boolean;
};
