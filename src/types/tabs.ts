export interface Tab {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
