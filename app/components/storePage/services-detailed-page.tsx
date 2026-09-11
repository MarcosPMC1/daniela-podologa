"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./footer";
import { formatPriceLabel, pricePrefix, type PriceLike } from "./price-utils";

interface Service {
  id: string;
  name: string;
  description: string;
  prices?: PriceLike[];
  durationMinutes: number;
  isactive: boolean;
  customMedia?: string | null;
  customMediaType?: "image" | "video";
  customMediaPosition?: "top" | "center" | "bottom";
}

interface ServicesDetailedPageProps {
  data: {
    avatarUrl?: string;
    name: string;
    contact: string;
    slogan?: string;
    services: Service[];
    page?: {
      primaryColor?: string;
      secondaryColor?: string;
      backgroundColor?: string;
      googleAnalytics?: boolean;
      content?: {
        services?: {
          services?: Array<{
            id: string;
            media?: string | null;
            media_type?: "image" | "video";
            media_position?: "top" | "center" | "bottom";
          }>;
        };
      };
    };
  };
}

export function ServicesDetailedPage({ data }: ServicesDetailedPageProps) {
  const primaryColor = data.page?.primaryColor || "#6366f1";

  function fireServiceGaEvent() {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("event", "cta_wpp_service", {
        event_category: "CTA",
        event_label: "service_card_click",
      })
    }
  }

  const customServicesContent = data.page?.content?.services?.services || [];
  const selectedServices = (data.services ?? []).filter((s) => s.isactive).map(s => {
    const customConfig = customServicesContent.find(c => c.id === s.id);
    return {
      ...s,
      customMedia: customConfig?.media,
      customMediaType: customConfig?.media_type,
      customMediaPosition: customConfig?.media_position,
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div
      className="min-h-screen pb-20 select-none bg-custom-background"
      style={
        {
          "--custom-primary": primaryColor,
          "--custom-background": data.page?.backgroundColor || "#ffffff",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        :root {
          --custom-primary: ${primaryColor};
        }
      `}</style>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${data.slogan}`}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            {data.avatarUrl && (
              <div className="w-8 h-8 relative rounded-full overflow-hidden border">
                <Image
                  src={data.avatarUrl}
                  alt={data.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-bold text-sm sm:text-base truncate max-w-[150px]">
              {data.name}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section Page */}
      <section className="relative py-16 px-4 overflow-hidden bg-custom-primary/5">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-custom-primary/10 text-custom-primary text-sm font-semibold mb-2"
          >
            <Tag className="w-4 h-4" />
            Nossos Serviços
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Serviços de <span style={{ color: primaryColor }}>{data.name}</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Confira nossa lista completa de serviços realizados com excelência e dedicação.
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-custom-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-custom-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Services List */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        {selectedServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground italic">Nenhum serviço disponível no momento.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {selectedServices.map((service) => (
              <motion.div key={service.id} variants={item}>
                <Link href={`/store/${data.slogan}/servicos/${service.id}`} onClick={fireServiceGaEvent}>
                  <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-primary/5 overflow-hidden rounded-3xl bg-card/50 backdrop-blur-sm cursor-pointer flex flex-col">
                    <CardContent className="p-0 flex-1 flex flex-col">
                      {/* Media Image/Video */}
                      {service.customMedia && (
                        <div className="w-full aspect-video relative overflow-hidden bg-muted/20">
                          {service.customMediaType === 'video' ? (
                            <video
                              src={service.customMedia}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              style={{ objectPosition: service.customMediaPosition === 'top' ? 'top' : service.customMediaPosition === 'bottom' ? 'bottom' : 'center' }}
                            />
                          )}
                        </div>
                      )}

                      <div className="p-8 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-xl font-bold group-hover:text-custom-primary transition-colors">
                              {service.name}
                            </h3>
                            <div
                              className="p-2 rounded-xl bg-custom-primary/10 shrink-0 group-hover:bg-custom-primary group-hover:text-white transition-all"
                              style={{ color: primaryColor }}
                            >
                              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                          {service.durationMinutes > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {service.durationMinutes} minutos
                            </div>
                          )}
                        </div>

                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                          {service.description || "Sem descrição disponível."}
                        </p>

                        <Separator className="bg-primary/5" />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                              {pricePrefix(service.prices)}
                            </p>
                            <p className="text-2xl font-black text-custom-primary">
                              {(() => {
                                const label = formatPriceLabel(service.prices);
                                return label ? label : (
                                  <span className="text-lg italic">Entre em contato para valores</span>
                                );
                              })()}
                            </p>
                          </div>
                        </div>

                        <Button
                          className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all pointer-events-none group-hover:pointer-events-auto"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <div className="flex items-center justify-center">
                            <span className="mr-2">Detalhes e Agendamento</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer minimal */}
      <Footer />
    </div>
  );
}
