import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";

export type MetricStatCardProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  // style variants for subtle differences across tabs
  variant?: "default" | "compact" | "plain";
  // optional classes passthrough
  className?: string;
  headerClassName?: string;
  valueClassName?: string;
};

export default function MetricStatCard({
  label,
  value,
  icon,
  variant = "default",
  className = "",
  headerClassName = "",
  valueClassName = "",
}: MetricStatCardProps) {
  const isCompact = variant === "compact";
  const isPlain = variant === "plain";

  // Choose structure: default uses header+content, compact uses single content area
  if (isCompact) {
    return (
      <Card className={`pt-3 pb-3 ${className}`}>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-gray-500 tracking-wide">{label}</div>
              <div className={`text-3xl font-semibold text-gray-900 mt-1 ${valueClassName}`}>{value}</div>
            </div>
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 [&>svg]:w-6 [&>svg]:h-6">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPlain) {
    return (
      <Card className={`shadow-md shadow-gray-200/40 ${className}`}>
        <CardContent className="px-4-1 py-0">
          <div className="flex items-center justify-between">
            <span className="text-medium font-semibold text-gray-500 tracking-wide">{label}</span>
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <div className="[&>svg]:w-7 [&>svg]:h-7">{icon}</div>
              </div>
            )}
          </div>
          <div className={`text-3xl font-semibold text-gray-900 mt-1 ${valueClassName}`}>{value}</div>
        </CardContent>
      </Card>
    );
  }

  // default
  return (
    <Card className={`pt-5 pb-0 ${className}`}>
      <CardHeader className={`flex flex-row items-center justify-between gap-3 ${headerClassName}`}>
        <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">{label}</CardTitle>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 [&>svg]:w-6 [&>svg]:h-6">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className={`text-3xl font-semibold text-gray-900 ${valueClassName}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
