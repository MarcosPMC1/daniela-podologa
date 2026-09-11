/**
 * Utility to handle the new responsive image pattern.
 * Replaces the default '-1920.webp' suffix with requested sizes.
 */

export const IMAGE_SIZES = [400, 800, 1200, 1600, 1920] as const;

export function getImageUrl(url: string | undefined, width: number | string): string {
  if (!url) return "";

  // Handle the new 1920 pattern
  if (url.includes("-1920.webp")) {
    return url.replace("-1920", `-${width}`);
  }

  // Handle the old original pattern (fallback during transition)
  if (url.includes("-original")) {
    return url.replace("-original", `-${width}`);
  }

  return url;
}

export function getImageSrcSet(url: string | undefined): string {
  if (!url) return "";

  const isResponsive = url.includes("-1920.webp") || url.includes("-original");
  if (!isResponsive) return ""; // Don't generate srcset for non-conforming URLs

  return IMAGE_SIZES.map((w) => `${getImageUrl(url, w)} ${w}w`).join(", ");
}
