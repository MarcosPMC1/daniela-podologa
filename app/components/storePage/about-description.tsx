'use client'

import { useState } from "react"
import { getImageSrcSet, getImageUrl } from "./image-utils"

interface AboutDescriptionProps {
  title?: string
  description?: string
  media?: string
  media_type?: 'image' | 'video'
  layout_media?: 'left' | 'right' | 'background'
  _cards?: {
    title?: string
    description?: string
    media?: string
    media_type?: 'image' | 'video'
  }[]
  mutedTextColor?: string
  primaryColor?: string
  altText?: string
}

function AboutMedia({
  media,
  media_type,
  alt,
  className,
  width,
}: {
  media: string
  media_type?: 'image' | 'video'
  alt: string
  className?: string
  width?: number
}) {
  if (media_type === 'video') {
    return (
      <video
        src={media}
        preload="none"
        className={className}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    )
  }
  return (
    <img
      src={getImageUrl(media, width ?? 800)}
      srcSet={getImageSrcSet(media)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1280px) 40vw, 500px"
      alt={alt}
      className={className}
      loading="lazy"
    />
  )
}

function ExpandableText({
  description,
  mutedTextColor,
  primaryColor,
}: {
  description: string
  mutedTextColor: string
  primaryColor: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = description.length > 400

  return (
    <div className="relative">
      <p
        className={`text-lg leading-relaxed whitespace-pre-line ${mutedTextColor} ${!isExpanded && isLong ? 'line-clamp-[8]' : ''}`}
      >
        {description}
      </p>
      {isLong && (
        <button
          className="mt-2 text-sm font-semibold hover:underline"
          style={{ color: primaryColor }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}

export function AboutDescription({
  title,
  description,
  media,
  media_type,
  layout_media = 'background',
  mutedTextColor = 'text-gray-500',
  primaryColor = '#0a9900',
  altText = 'Imagem sobre nós',
}: AboutDescriptionProps) {

  const mediaEl = media ? (
    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background flex-shrink-0 aspect-square min-h-[300px] bg-zinc-100">
      <AboutMedia
        media={media}
        media_type={media_type}
        alt={altText}
        className="w-full h-auto hover:scale-105 transition-transform duration-700"
        width={400}
      />
    </div>
  ) : null

  const textEl = (
    <div className="space-y-4">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: primaryColor }}>
          {title}
        </h2>
      )}
      {description && (
        <ExpandableText
          description={description}
          mutedTextColor={mutedTextColor}
          primaryColor={primaryColor}
        />
      )}
    </div>
  )

  // ── Background: stacked (text above, media below as hero-style banner) ──
  if (layout_media === 'background') {
    return (
      <div className="space-y-8">
        {media ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-zinc-100">
            <AboutMedia
              media={media}
              media_type={media_type}
              alt={altText}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/40" />
            {title && (
              <div className="absolute inset-0 flex items-end p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{title}</h2>
              </div>
            )}
          </div>
        ) : title && (
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: primaryColor }}>{title}</h2>
        )}
        {description && (
          <ExpandableText description={description} mutedTextColor={mutedTextColor} primaryColor={primaryColor} />
        )}
      </div>
    )
  }

  // ── Left / Right split ──
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className={layout_media === 'right' ? 'lg:order-last' : ''}>
        {mediaEl}
      </div>
      <div>
        {textEl}
      </div>
    </div>
  )
}
