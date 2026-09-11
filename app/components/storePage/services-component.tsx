"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatPriceLabel, type PriceLike } from "./price-utils";

interface Service {
  id: string | number
  name: string
  description?: string
  prices?: PriceLike[]
  benefit?: string
  customMedia?: string | null
  customMediaType?: "image" | "video"
  customMediaPosition?: "top" | "center" | "bottom"
}

interface ServicesProps {
  selectedServices: Service[]
  primaryColor: string
  mutedTextColor?: string
  data: {
    contact: string
    slogan?: string
  }
  content?: {
    services?: {
      title?: string
    }
  }
}

function fireServiceGaEvent() {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", "cta_wpp_service", {
      event_category: "CTA",
      event_label: "service_card_click",
    })
  }
}

export default function ServicesSection({
  selectedServices,
  primaryColor,
  mutedTextColor = "text-muted-foreground",
  data,
  content,
}: ServicesProps) {
  if (!selectedServices?.length) return null

  return (
    <section
      className="w-full px-4 sm:px-8 lg:px-16 py-12 md:py-20 space-y-10"
      aria-labelledby="services-heading"
    >
      {/* H2 principal */}
      <Link href={`/store/${data.slogan}/servicos`} className="inline-block group">
        <h2
          id="services-heading"
          className="text-3xl font-bold mb-6 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          {content?.services?.title ?? "Serviços"}
          <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h2>
      </Link>

      {/* Grid semântico */}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedServices.map((service, index) => {
          const priceLabel = formatPriceLabel(service.prices);

          return (
            <li key={service.id} className="h-full">
              <Link href={`/store/${data.slogan}/servicos/${service.id}`} className="block h-full outline-none group/card" onClick={fireServiceGaEvent}>
                <Card
                  className={`rounded-3xl transition-all duration-300 transform group-hover/card:-translate-y-2 group-hover/card:shadow-xl focus-within:shadow-xl h-full flex flex-col overflow-hidden border-0 ring-1 ring-black/5 ${index === 0 ? "shadow-lg bg-white" : "bg-white/80 backdrop-blur-sm"
                    } cursor-pointer`}
                >
                  {/* Media (if available, full-bleed at top) */}
                  {service.customMedia && (
                    <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                      {service.customMediaType === 'video' ? (
                        <video
                          src={service.customMedia}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.customMedia}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                          style={{ objectPosition: service.customMediaPosition === 'top' ? 'top' : service.customMediaPosition === 'bottom' ? 'bottom' : 'center' }}
                        />
                      )}
                    </div>
                  )}

                  <CardContent className="p-8 flex flex-col justify-between flex-grow space-y-6">
                    {/* Título e micro-benefício */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold leading-tight group-hover/card:text-primary transition-colors">{service.name}</h3>
                      {service.benefit && (
                        <div className="inline-flex py-1 px-3 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                          {service.benefit}
                        </div>
                      )}
                      {service.description && (
                        <p className={`text-sm leading-relaxed ${mutedTextColor} line-clamp-3`}>
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-5 pt-4 border-t border-border/50">
                      {/* Preço com destaque */}
                      <div className="font-bold text-2xl" style={{ color: primaryColor }}>
                        {priceLabel ? (
                          <>
                            {priceLabel}{" "}
                          </>
                        ) : (
                          <span className="text-lg italic text-muted-foreground">Consulte valores</span>
                        )}
                      </div>

                      {/* CTA WhatsApp / Link */}
                      <div className="relative overflow-hidden w-full group/btn">
                        <div
                          className="flex items-center justify-center w-full px-6 py-4 rounded-2xl text-white font-bold transition-transform duration-300"
                          style={{ backgroundColor: primaryColor }}
                          aria-hidden="true"
                        >
                          <span className="relative z-10 flex items-center space-x-2">
                            <span>Agendar agora</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </span>
                        </div>
                        {/* Hover shining effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                      </div>
                      <span className="sr-only">Ver detalhes e agendar {service.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Link para página detalhada */}
      <div className="flex justify-center mt-12">
        <Button
          variant="outline"
          className="rounded-2xl px-8 py-6 h-auto border-2 border-custom-primary/20 hover:bg-custom-primary hover:text-white transition-all duration-300 font-bold text-lg"
          style={{
            borderColor: `${primaryColor}33`, // 20% opacity hex
          }}
        >
          <Link href={`/store/${data.slogan}/servicos`}>
            Ver catálogo completo de serviços
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  )
}