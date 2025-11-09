"use client";
import IconVideo from "@/components/icon/icon-video";
import React from "react";
import { getYoutubeEmbedUrl } from "@/utils/video";

interface Props {
  tutorials?: string[];
}

// Display vertical list with lazy-loaded iframes (solo opción 2: lazy loading)
const ProductTutorialsDisplay: React.FC<Props> = ({ tutorials }) => {
  if (!tutorials || tutorials.length === 0) return null;
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <IconVideo className="mr-2 w-5 h-5" /> Tutoriales
      </h3>
      <div className="space-y-6">
        {tutorials.map((url, idx) => {
          const embed = getYoutubeEmbedUrl(url);
          return (
            <div key={idx} className="w-full">
              {embed ? (
                <div className="w-full aspect-video bg-gray-100 rounded overflow-hidden">
                  <iframe
                    loading="lazy"
                    src={embed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Tutorial ${idx + 1}`}
                  />
                </div>
              ) : (
                <div className="text-xs text-red-600">
                  URL inválida de YouTube: {url}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTutorialsDisplay;
