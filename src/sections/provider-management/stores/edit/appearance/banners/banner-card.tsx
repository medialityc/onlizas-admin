"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/cards/card";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BannerItem } from "@/types/stores";


interface BannerCardProps {
  banner: BannerItem;
  positionLabel: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (banner: BannerItem) => void;
}

export default function BannerCard({ 
  banner, 
  positionLabel, 
  onToggle, 
  onDelete, 
  onEdit 
}: BannerCardProps) {
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <BannerImage banner={banner} />
            <BannerInfo banner={banner} positionLabel={positionLabel} />
          </div>
          <BannerActions 
            banner={banner}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BannerImage({ banner }: { banner: BannerItem }) {

  if (banner.image) {  
    // Si es File, crear URL temporal
    return (
      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image 
          src={banner.image instanceof File ? URL.createObjectURL(banner.image) :banner.image} 
          alt={banner.title}
          width={48}
          height={48}
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }
  
  return (
    <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <span className="text-gray-300 dark:text-gray-500 text-xl">🖼️</span>
    </div>
  );
}

function BannerInfo({ banner, positionLabel }: { banner: BannerItem; positionLabel: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{banner.title}</div>
        {banner.isActive && (
          <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-600/30">
            Activo
          </span>
        )}
        <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-600/10 dark:ring-gray-600/20">
          {positionLabel}
        </span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400"><a href={banner.urlDestinity}>{banner.urlDestinity.substring(0, 10)}</a> </div>
      {(banner.initDate || banner.endDate) && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {banner.initDate ? banner.initDate.substring(0, 10) : ""} 
          {banner.endDate ? ` - ${banner.endDate.substring(0, 10)}` : ""}
        </div>
      )}
    </div>
  );
}

function BannerActions({ 
  banner, 
  onToggle, 
  onDelete, 
  onEdit 
}: { 
  banner: BannerItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (banner: BannerItem) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Toggle Switch */}
      <button
        type="button"
        aria-label="Cambiar estado"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          banner.isActive 
            ? "bg-gradient-to-r from-secondary to-indigo-600" 
            : "bg-gray-300 dark:bg-gray-600"
        }`}
        onClick={() => (banner.id != null ? onToggle(banner.id) : undefined)}

      >
        <span 
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            banner.isActive ? "translate-x-5" : "translate-x-1"
          }`} 
        />
      </button>
      
      {/* Edit Button */}
      <button
        type="button"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Editar"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit(banner);
        }}
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>
      
      {/* Delete Button */}
      <button
        type="button"
        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        aria-label="Eliminar"
        onClick={() => (banner.id != null ? onDelete(banner.id) : undefined)}

      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
