import { ImageIcon } from "lucide-react";
import { getImageSrcSet, getImageUrl } from "./image-utils";

interface GalleryComponentProps {
  data: {
    galleries?: {
      id: string;
      url: string;
      isvideo: boolean;
    }[];
  };
  content: {
    galeria?: {
      title?: string;
      selectedIds?: string[];
    };
  };
  primaryColor?: string;
}

export function GalleryComponent({
  data,
  content,
  primaryColor = "#0a9900",
}: GalleryComponentProps) {
  const selectedIds = content?.galeria?.selectedIds ?? [];
  const galleryItems = (data?.galleries ?? []).filter((item) =>
    selectedIds.includes(item.id)
  );

  if (galleryItems.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 py-16 lg:py-24" aria-label="Galeria">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div
            className="p-2.5 rounded-2xl"
            style={{ backgroundColor: primaryColor + "22" }}
          >
            <ImageIcon className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-3xl font-bold">
            {content.galeria?.title || "Nossa Galeria"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/10 bg-zinc-100"
            >
              {item.isvideo ? (
                <video
                  src={item.url}
                  preload="none"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={getImageUrl(item.url, 400)}
                  srcSet={getImageSrcSet(item.url)}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt="Gallery item"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
