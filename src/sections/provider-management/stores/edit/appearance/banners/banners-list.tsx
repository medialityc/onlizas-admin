"use client";

import React from "react";
import BannerCard from "./banner-card";
import { BannerItem } from "@/types/stores";


interface BannersListProps {
  banners: BannerItem[];
  getPositionLabel: (position: number) => string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (banner: BannerItem) => void;
}

export default function BannersList({ 
  banners, 
  getPositionLabel, 
  onToggle, 
  onDelete, 
  onEdit 
}: BannersListProps) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📢</div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No hay banners</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Comienza creando tu primer banner promocional
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {banners.map((banner, index) => (
        <BannerCard
          key={banner.id ?? `banner-${index}`}
          banner={banner}
          positionLabel={getPositionLabel(Number(banner.position))}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
