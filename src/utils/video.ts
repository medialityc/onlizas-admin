// Utils de video (YouTube)
// Extrae ID y convierte en URL de embed. Devuelve null si no es válida.
export const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    const regex =
      /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;
    const match = trimmed.match(regex);
    if (!match) return null;
    return `https://www.youtube.com/embed/${match[1]}`;
  } catch (_) {
    return null;
  }
};

// Extrae el ID del video YouTube (11 chars) o null
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regex =
    /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;
  const match = url.trim().match(regex);
  return match ? match[1] : null;
};

// Devuelve URL de thumbnail HD si existe, fallback a default
export const getYoutubeThumbnailUrl = (url: string): string | null => {
  const id = extractYoutubeId(url);
  if (!id) return null;
  // hqdefault normalmente disponible
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
};

// Obtiene metadata vía oEmbed (title, author_name, thumbnail_url). Maneja errores devolviendo undefined
export interface YoutubeOEmbedData {
  title: string;
  author_name: string;
  thumbnail_url: string;
  provider_name?: string;
}

export const fetchYoutubeOEmbed = async (
  url: string
): Promise<YoutubeOEmbedData | undefined> => {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(endpoint);
    if (!res.ok) return undefined;
    const data = await res.json();
    return {
      title: data.title,
      author_name: data.author_name,
      thumbnail_url: data.thumbnail_url,
      provider_name: data.provider_name,
    };
  } catch (_) {
    return undefined;
  }
};
export const isValidYoutubeUrl = (url: string): boolean =>
  !!getYoutubeEmbedUrl(url);
