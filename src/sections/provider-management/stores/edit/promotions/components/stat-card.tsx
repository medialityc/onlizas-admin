import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";

interface Props {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: Props) {
  return (
    <Card className="pt-5 pb-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">
          {label}
        </CardTitle>
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 [&>svg]:w-6 [&>svg]:h-6">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="text-3xl font-semibold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}
