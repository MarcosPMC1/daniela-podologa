"use client";

import Link from "next/link";
import { getImageUrl, getImageSrcSet } from "./image-utils";
import { cn } from "@/app/lib/utils";

interface HeroProps {
  data: {
    name: string;
    street_name: string;
    address_number: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  };
  content: {
    hero?: {
      media: string;
      media_type?: "image" | "video";
      layout_media?: "left" | "right" | "background";
      border_media?: boolean;
      title?: string;
      subtitle?: string;
      description?: string;
      cta?: {
        label: string;
        link: string;
      };
    };
    header?: {
      title?: string;
    };
  };
  primaryColor?: string;
  primaryContrast?: string;
  bgContrast?: "white" | "black";
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function MediaElement({
  media,
  mediaType,
  alt,
  className,
}: {
  media: string;
  mediaType?: "image" | "video";
  alt: string;
  className?: string;
}) {
  if (mediaType === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={className}
        aria-label="Vídeo decorativo"
      >
        <source src={media} />
      </video>
    );
  }

  return (
    <img
      src={getImageUrl(media, 800)}
      srcSet={getImageSrcSet(media)}
      sizes="(max-width: 500px) 100vw, (max-width: 1024px) 80vw, (max-width: 1280px) 50vw, 800px"
      alt={alt}
      fetchPriority="high"
      loading="eager"
      decoding="async"
      width={800}
      height={450}
      className={className}
      style={{ objectPosition: "center" }}
    />
  );
}

function fireHeroGaEvent() {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", "hero_cta_click", {
      event_category: "CTA",
      event_label: "hero_main_button",
    })
  }
}

function HeroText({
  title,
  description,
  cta,
  primaryColor,
  primaryContrast,
  textColor,
  align = "left",
}: {
  title: string;
  description?: string;
  cta?: { label: string; link: string };
  primaryColor: string;
  primaryContrast: string;
  textColor: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`space-y-6 ${align === "center" ? "text-center" : "text-center lg:text-left"}`}
    >
      <h2
        className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg"
        style={{ color: textColor }}
      >
        {title}
      </h2>

      {description && (
        <p
          className="text-lg md:text-xl font-medium leading-relaxed max-w-xl drop-shadow-md"
          style={{ color: textColor, opacity: 0.9 }}
        >
          {description}
        </p>
      )}

      {cta?.label && cta?.link && (
        <div className="inline-block relative group hero-cta-pulse">
          <Link
            href={cta.link}
            style={{ backgroundColor: primaryColor, color: primaryContrast }}
            className="relative overflow-hidden inline-block hover:opacity-90 transition-all font-semibold text-lg px-10 py-4 rounded-2xl shadow-xl transform"
            aria-label={cta.label}
            onClick={fireHeroGaEvent}
          >
            {/* Shimmer effect via CSS */}
            <span className="hero-cta-shimmer" aria-hidden="true" />
            <span className="relative z-10">{cta.label}</span>
          </Link>

          {/* Ring on hover for interactivity */}
          <div
            className="absolute -inset-1 rounded-[1.25rem] border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ borderColor: primaryColor }}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout variants
// ─────────────────────────────────────────────────────────────────────────────

/** layout_media === "background" (original behaviour) */
function BackgroundLayout({
  data,
  content,
  primaryColor,
  primaryContrast,
}: HeroProps) {
  const hero = content?.hero;

  return (
    <section
      className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-900"
      aria-label="Hero"
    >
      {/* Background media + overlay */}
      {hero?.media && (
        <div className="absolute inset-0 z-0">
          <MediaElement
            media={hero.media}
            mediaType={hero.media_type}
            alt={hero.title ?? data.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-24">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <HeroText
            title={hero?.title ?? content?.header?.title ?? data.name}
            description={hero?.description ?? hero?.subtitle}
            cta={hero?.cta}
            primaryColor={primaryColor!}
            primaryContrast={primaryContrast!}
            textColor="white"
            align="center"
          />
        </div>
      </div>
    </section>
  );
}

/** layout_media === "left" | "right" — split-screen layout */
function SplitLayout({
  data,
  content,
  primaryColor,
  primaryContrast,
  bgContrast,
  mediaOnLeft,
}: HeroProps & { mediaOnLeft: boolean }) {
  const hero = content?.hero;
  const textColor = bgContrast === "black" ? "#000000" : "#ffffff";

  const mediaColumn = (
    <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-20">
      {hero?.media ? (
        <div className={cn(
          "w-full max-w-xl overflow-hidden aspect-video",
          hero.border_media !== false && "rounded-3xl shadow-2xl ring-1 ring-black/10"
        )}>
          <MediaElement
            media={hero.media}
            mediaType={hero.media_type}
            alt={hero.title ?? data.name}
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className={cn(
          "w-full max-w-xl aspect-video bg-zinc-200 shadow-inner flex items-center justify-center",
          hero?.border_media !== false && "rounded-3xl ring-1 ring-black/10"
        )}>
          <span className="text-zinc-400 text-sm">Sem mídia</span>
        </div>
      )}
    </div>
  );

  const textColumn = (
    <div className="flex-1 flex items-center justify-center px-8 py-16 lg:py-24">
      <div className="max-w-lg w-full space-y-8">
        <HeroText
          title={hero?.title ?? content?.header?.title ?? data.name}
          description={hero?.description ?? hero?.subtitle}
          cta={hero?.cta}
          primaryColor={primaryColor!}
          primaryContrast={primaryContrast!}
          textColor={textColor}
        />
      </div>
    </div>
  );

  return (
    <section
      className="relative w-full min-h-[60vh] flex flex-col lg:flex-row overflow-hidden"
      aria-label="Hero"
    >
      <div className={cn("flex-1 flex", !mediaOnLeft && "lg:order-last")}>
        {mediaColumn}
      </div>
      <div className="flex-1 flex">
        {textColumn}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — routes to the correct layout
// ─────────────────────────────────────────────────────────────────────────────

export const HeroSection: React.FC<HeroProps> = (props) => {
  const {
    primaryColor = "#0a9900",
    primaryContrast = "#ffffff",
    bgContrast = "white",
    content,
  } = props;

  const layout = content?.hero?.layout_media ?? "background";

  const merged = { ...props, primaryColor, primaryContrast, bgContrast };

  if (layout === "left") {
    return <SplitLayout {...merged} mediaOnLeft={true} />;
  }

  if (layout === "right") {
    return <SplitLayout {...merged} mediaOnLeft={false} />;
  }

  // default: "background"
  return <BackgroundLayout {...merged} />;
};