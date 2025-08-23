import React from "react";

type Props = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
};

export default function MetricCard({ label, value, icon }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-md shadow-gray-200/40">
      <div className="flex items-center justify-between">
        <span className="text-medium font-semibold text-gray-500 tracking-wide">{label}</span>
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          {/* icon size a bit larger */}
          <div className="[&>svg]:w-7 [&>svg]:h-7">{icon}</div>
        </div>
      </div>
      <div className="text-3xl font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
