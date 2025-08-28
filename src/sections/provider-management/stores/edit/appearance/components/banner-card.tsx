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

  if (typeof banner.image === 'string') {
    // Si es string, es una URL del backend
    return (
      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
        <Image 
          src={banner.image} 
          alt={banner.title}
          width={48}
          height={48}
          className="w-full h-full object-cover" 
          
        /> 
      </div>
    );
  } else if (banner.image instanceof File) {
    // Si es File, crear URL temporal
    return (
      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
        <Image 
          src={URL.createObjectURL(banner.image) ?? ""} 
          alt={banner.title}
          width={48}
          height={48}
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }
  
  return (
    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
      <span className="text-gray-300 text-xl">🖼️</span>
    </div>
  );
}

function BannerInfo({ banner, positionLabel }: { banner: BannerItem; positionLabel: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-900">{banner.title}</div>
        {banner.isActive && (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Activo
          </span>
        )}
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
          {positionLabel}
        </span>
      </div>
      <div className="text-xs text-gray-500"><a href={banner.urlDestinity}>{banner.urlDestinity.substring(0, 10)}</a> </div>
      {(banner.initDate || banner.endDate) && (
        <div className="text-xs text-gray-400 mt-0.5">
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
            : "bg-gray-300"
        }`}
        onClick={() => onToggle(banner.id)}
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
        className="text-gray-500 hover:text-gray-700 transition-colors"
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
        className="text-gray-500 hover:text-red-600 transition-colors"
        aria-label="Eliminar"
        onClick={() => onDelete(banner.id)}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
