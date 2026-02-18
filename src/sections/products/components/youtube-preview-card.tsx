"use client";
import React, { useEffect, useState } from "react";
import {
  getYoutubeThumbnailUrl,
  fetchYoutubeOEmbed,
  getYoutubeEmbedUrl,
} from "@/utils/video";
import IconPlayCircle from "@/components/icon/icon-play-circle";
import SimpleModal from "@/components/modal/modal";
import { Button } from "@/components/button/button";

interface Props {
  url: string;
  index?: number;
  compact?: boolean; // muestra versión miniatura
}

interface OEmbedState {
  loading: boolean;
  data?: {
    title: string;
    author_name: string;
    thumbnail_url: string;
  };
}

const YoutubePreviewCard: React.FC<Props> = ({ url, index, compact }) => {
  const [oembed, setOembed] = useState<OEmbedState>({ loading: true });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchYoutubeOEmbed(url);
      if (!active) return;
      if (data) setOembed({ loading: false, data });
      else {
        // fallback manual thumbnail
        const thumb = getYoutubeThumbnailUrl(url);
        setOembed({
          loading: false,
          data: thumb
            ? {
                title: "Video de YouTube",
                author_name: "YouTube",
                thumbnail_url: thumb,
              }
            : undefined,
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [url]);

  const embed = getYoutubeEmbedUrl(url);
  const thumb = oembed.data?.thumbnail_url;

  return (
    <div
      className={
        compact
          ? "group relative rounded-md border overflow-hidden bg-gray-900 text-white w-48"
          : "group relative rounded-lg border overflow-hidden bg-gray-900 text-white"
      }
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left focus:outline-none"
      >
        <div
          className={
            compact
              ? "relative w-full aspect-video bg-gray-800"
              : "relative w-full aspect-video bg-gray-800"
          }
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={oembed.data?.title || `Tutorial ${index}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              Sin vista previa
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 text-black rounded-full p-4 shadow-md group-hover:scale-105 transition">
              {IconPlayCircle ? (
                <IconPlayCircle className="w-8 h-8" />
              ) : (
                <span className="text-xl">▶</span>
              )}
            </div>
          </div>
        </div>
        <div className={compact ? "p-2 space-y-0" : "p-3 space-y-1"}>
          <p
            className={
              compact
                ? "text-[11px] font-medium leading-snug line-clamp-2"
                : "text-sm font-semibold line-clamp-2"
            }
          >
            {oembed.data?.title || "Video de YouTube"}
          </p>
          <p
            className={
              compact ? "text-[10px] text-gray-300" : "text-xs text-gray-300"
            }
          >
            {oembed.data?.author_name || "YouTube"}
          </p>
        </div>
      </button>
      <SimpleModal
        open={open}
        onClose={() => setOpen(false)}
        title={oembed.data?.title || "Video"}
        className="max-w-3xl"
      >
        {embed ? (
          <div className="aspect-video w-full">
            <iframe
              src={embed}
              className="w-full h-full rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="text-sm text-red-600">URL inválida.</div>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </div>
      </SimpleModal>
    </div>
  );
};

export default YoutubePreviewCard;
