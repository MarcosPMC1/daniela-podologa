import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"
import Image from "next/image"
import React from "react"
import ReactDOM from "react-dom"
import { WhatsAppButton } from "./cta"
import { getImageSrcSet, getImageUrl } from "./image-utils"

// ── DYNAMIC IMPORTS ──
import { AboutSection } from "./about-component"
import { HeroSection } from "./hero-component"
import OpeningHours from "./openingHours-component"
import ServicesSection from "./services-component"

const LocationSection = dynamic(() => import("./location-section").then(mod => mod.LocationSection), { ssr: true })
const GalleryComponent = dynamic(() => import("./gallery-component").then(mod => mod.GalleryComponent), { ssr: true })
const ReviewsComponent = dynamic(() => import("./reviews-component").then(mod => mod.ReviewsComponent), { ssr: true })
const BlogSection = dynamic(() => import("./blog-component").then(mod => mod.BlogSection), { ssr: true })
const Footer = dynamic(() => import("./footer").then(mod => mod.Footer), { ssr: true })

function getContrastColor(hexColor: string): "white" | "black" {
  if (!hexColor) return "black"
  const hex = hexColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // WCAG relative luminance formula
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return l >= 0.5 ? "black" : "white"
}

export default async function TenantPage({ data }: { data: any }) {
  const page = data?.page
  const content = page?.content

  // Serviços filtrados pela lista de services da page (com media customizada)
  const contentServices: Array<{ id: string; media?: string | null; media_type?: 'image' | 'video'; media_position?: 'top' | 'center' | 'bottom' }> = content?.services?.services ?? []
  const selectedServiceIds: string[] = contentServices.map((s: any) => s.id)
  const contact = content?.services?.contact
  const selectedServices = (data?.services ?? [])
    .filter((s: any) => s.isactive && selectedServiceIds.includes(s.id))
    .map((s: any) => {
      const customConfig = contentServices.find((c: any) => c.id === s.id)
      return {
        ...s,
        customMedia: customConfig?.media ?? null,
        customMediaType: customConfig?.media_type ?? 'image',
        customMediaPosition: customConfig?.media_position ?? 'center',
      }
    })

  const primaryColor = page?.primaryColor || "#6366f1"
  const secondaryColor = page?.secondaryColor || "#8b5cf6"
  const backgroundColor = page?.backgroundColor || "#ffffff"

  const bgContrast = getContrastColor(backgroundColor)
  const primaryContrast = getContrastColor(primaryColor)
  const mutedTextColor = bgContrast === "white" ? "text-gray-300" : "text-muted-foreground"

  // ── PRELOAD LCP IMAGE ──
  const heroMedia = content?.hero?.media
  if (heroMedia) {
    // Preload the main hero image with high priority
    // Using the same URL logic as MediaElement (1920w for fallback/large)
    const preloadUrl = getImageUrl(heroMedia, 800)
    ReactDOM.preload(preloadUrl, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: getImageSrcSet(heroMedia),
      imageSizes: "(max-width: 500px) 100vw, (max-width: 1024px) 80vw, (max-width: 1280px) 50vw, 800px"
    } as any)
  }

  // ── DYNAMIC SECTIONS ORDERING ──
  const sections = [
    {
      id: "about",
      order: content?.about?.order ?? 1,
      component: (
        <AboutSection
          key="about"
          content={content}
          data={data}
          primaryColor={primaryColor}
          mutedTextColor={mutedTextColor}
          _backgroundColor={backgroundColor}
        />
      ),
      show: !!(content?.about?.title || content?.about?.description || content?.about?.media)
    },
    {
      id: "services",
      order: content?.services?.order ?? 2,
      component: (
        <ServicesSection
          key="services"
          selectedServices={selectedServices}
          primaryColor={primaryColor}
          mutedTextColor={mutedTextColor}
          data={data}
          content={content}
        />
      ),
      show: selectedServices.length > 0
    },
    {
      id: "location",
      order: content?.location?.order ?? 3,
      component: (
        <LocationSection
          key="location"
          data={data}
          content={content}
          primaryColor={primaryColor}
          _bgContrast={bgContrast}
        />
      ),
      show: !!content?.location?.embedLink
    },
    {
      id: "galeria",
      order: content?.galeria?.order ?? 4,
      component: (
        <GalleryComponent
          key="galeria"
          data={data}
          content={content}
          primaryColor={primaryColor}
        />
      ),
      show: content?.galeria?.show !== false && (content?.galeria?.selectedIds?.length ?? 0) > 0
    },
    {
      id: "reviews",
      order: content?.reviews?.order ?? 5,
      component: (
        <ReviewsComponent
          key="reviews"
          content={content}
          primaryColor={primaryColor}
        />
      ),
      show: content?.reviews?.show !== false && (content?.reviews?.list?.length ?? 0) > 0
    },
    {
      id: "blog",
      order: content?.blog?.order ?? 6,
      component: (
        <BlogSection
          key="blog"
          content={content}
          data={data}
          primaryColor={primaryColor}
          mutedTextColor={mutedTextColor}
        />
      ),
      show: content?.blog?.show !== false && (content?.blog?.posts?.length ?? 0) > 0
    }
  ]

  const orderedSections = sections
    .filter(s => s.show)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <main
        className={`min - h - screen w - full transition - colors duration - 500 ${bgContrast === "white" ? "dark" : ""} `}
        style={
          {
            "--custom-primary": primaryColor,
            "--custom-secondary": secondaryColor,
            "--custom-background": backgroundColor,
            backgroundColor: "var(--custom-background)",
            color: bgContrast === "white" ? "#ffffff" : "#000000",
          } as React.CSSProperties
        }
      >

        {/* ── HEADER ── */}
        <header role="banner" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-4 sm:px-8 lg:px-16 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {content?.header?.showLogo !== false && data.avatarUrl && (
                <div className="w-9 h-9 relative rounded-lg overflow-hidden shadow-sm shrink-0">
                  <Image
                    src={getImageUrl(data.avatarUrl, 400)}
                    alt={`Logo de ${content?.header?.title ?? data.name} `}
                    width={36}
                    height={36}
                    sizes="36px"
                    priority={true}
                    fetchPriority="high"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg leading-none" style={{ color: primaryColor }}>
                  {content?.header?.title ?? data.name}
                </h1>
                {content?.header?.subtitle && (
                  <span className="hidden sm:inline text-xs text-muted-foreground mt-0.5">
                    {content.header.subtitle}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {orderedSections.map((section) => {
                const labels: Record<string, string> = {
                  about: "Sobre",
                  services: "Serviços",
                  location: "Localização",
                  galeria: "Galeria",
                  reviews: "Avaliações",
                  blog: "Blog",
                }
                return (
                  <a
                    key={section.id}
                    href={`#${section.id} `}
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    {labels[section.id] || section.id}
                  </a>
                )
              })}
            </nav>
          </div>
        </header>

        {/* ── HERO ── */}
        <HeroSection
          content={content}
          data={data}
          primaryColor={primaryColor}
          primaryContrast={primaryContrast}
          bgContrast={bgContrast}
        />

        <Separator style={{ backgroundColor: secondaryColor, opacity: 0.2 }} />

        {/* ── DYNAMIC SECTIONS ── */}
        {orderedSections.map((section, _index) => (
          <React.Fragment key={section.id}>
            <div id={section.id} className="scroll-mt-16">
              {section.component}
            </div>
            <Separator style={{ backgroundColor: secondaryColor, opacity: 0.2 }} />
          </React.Fragment>
        ))}

        {/* ── HORÁRIOS ── */}
        {content?.openingHours?.show !== false && data.oppeningHours && (
          <OpeningHours
            hours={data.oppeningHours}
            primaryColor={data.primaryColor}
            secondaryColor={data.secondaryColor}
            ctaLink={contact ? `https://wa.me/${contact.replace(/\D/g, "")}?text=Olá%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20horário` : undefined}
          />
        )}

        {/* ── FOOTER ── */}
        <Footer />

        {/* ── WHATSAPP BUTTON ── */}
        <WhatsAppButton contact={data.contact} />
      </main >
    </>
  )
}
