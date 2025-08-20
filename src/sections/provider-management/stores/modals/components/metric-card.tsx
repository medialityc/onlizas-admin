import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

export const MetricCard = ({ icon, label, value }: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-dark">{value}</p>
    </div>
  </div>
);
