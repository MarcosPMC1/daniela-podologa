import { Card, CardContent } from "@/components/ui/card";
import { AboutDescription } from "./about-description";
import { getImageSrcSet, getImageUrl } from "./image-utils";

interface AboutSectionProps {
  data: { name: string };
  content: {
    header?: { title?: string };
    about?: {
      order?: number;
      title?: string;
      description?: string;
      media?: string;
      media_type?: 'image' | 'video';
      layout_media?: 'left' | 'right' | 'background';
      cards?: {
        title?: string;
        description?: string;
        media?: string;
        media_type?: 'image' | 'video';
      }[];
    };
  };
  primaryColor?: string;
  mutedTextColor?: string;
  _backgroundColor?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  data,
  content,
  primaryColor = "#0a9900",
  mutedTextColor = "text-gray-500",
}) => {
  const about = content?.about;
  if (!about) return null;

  return (
    <section
      className="w-full px-4 sm:px-8 lg:px-16 py-12 md:py-20 space-y-12"
      aria-labelledby="about-heading"
    >
      {/* Main media + text block */}
      <AboutDescription
        title={about.title}
        description={about.description}
        media={about.media}
        media_type={about.media_type}
        layout_media={about.layout_media}
        mutedTextColor={mutedTextColor}
        primaryColor={primaryColor}
        altText={`Sobre ${content?.header?.title ?? data.name}`}
      />

      {/* Cards */}
      {about.cards && about.cards.length > 0 && (
        <ul
          className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          role="list"
        >
          {about.cards.map((card, i) => (
            <li key={i} className="flex flex-col h-full min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center">
              <Card
                className="rounded-2xl hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                aria-label={card.title}
              >
                {card.media && (
                  card.media_type === "video" ? (
                    <div className="relative w-full h-48 sm:h-56 bg-black flex-shrink-0">
                      <video
                        src={card.media}
                        preload="none"
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-48 sm:h-56 flex-shrink-0">
                      <img
                        src={getImageUrl(card.media, 400)}
                        srcSet={getImageSrcSet(card.media)}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        alt={card.title || "Imagem do card"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )
                )}
                <CardContent className="p-6 space-y-2 flex flex-col flex-grow">
                  {card.title && (
                    <h3 className="font-semibold text-lg">{card.title}</h3>
                  )}
                  {card.description && (
                    <p className={`text-sm md:text-base leading-relaxed ${mutedTextColor} flex-grow`}>
                      {card.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};