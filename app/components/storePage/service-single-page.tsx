"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock, Phone, Share2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppButton } from "./cta";
import { Footer } from "./footer";
import { formatPriceLabel, type PriceLike } from "./price-utils";

interface Service {
  id: string;
  name: string;
  description: string;
  prices?: PriceLike[];
  durationMinutes: number;
  isactive: boolean;
  customMedia?: string | null;
  customMediaType?: string;
  customMediaPosition?: string;
}

interface ServiceSinglePageProps {
  data: {
    avatarUrl?: string;
    name: string;
    contact: string;
    slogan?: string;
    page?: {
      primaryColor?: string;
      backgroundColor?: string;
      googleAnalytics?: boolean;
      content?: {
        services?: {
          services?: Array<{
            id: string;
            media?: string | null;
            media_type?: string;
            media_position?: string;
          }>;
        };
      };
    };
  };
  service: Service;
}

export function ServiceSinglePage({ data, service }: ServiceSinglePageProps) {
  const primaryColor = data.page?.primaryColor || "#6366f1";
  const backgroundColor = data.page?.backgroundColor || "#ffffff";

  const customServicesContent = data.page?.content?.services?.services || [];
  const customConfig = customServicesContent.find(c => c.id === service.id);
  const serviceWithMedia = { ...service, customMedia: customConfig?.media, customMediaType: customConfig?.media_type, customMediaPosition: customConfig?.media_position };

  const whatsappMessage = `Olá! Tenho interesse no serviço "${serviceWithMedia.name}" que vi no site de vocês. Poderiam me passar mais informações?`;

  return (
    <div
      className="min-h-screen pb-20 bg-custom-background"
      style={
        {
          "--custom-primary": primaryColor,
          "--custom-background": backgroundColor,
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
            href={`/store/${data.slogan}/servicos`}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Todos os Serviços</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 border-l pl-4">
              {data.avatarUrl && (
                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                  <Image src={data.avatarUrl} alt={data.name} fill className="object-cover" />
                </div>
              )}
              <span className="font-bold text-sm truncate max-w-[120px]">{data.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="md:col-span-8 space-y-8">
            {serviceWithMedia.customMedia && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full relative aspect-video mb-8 rounded-3xl overflow-hidden shadow-2xl bg-muted/20"
              >
                {serviceWithMedia.customMediaType === 'video' ? (
                  <video
                    src={serviceWithMedia.customMedia}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={serviceWithMedia.customMedia}
                    alt={serviceWithMedia.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: serviceWithMedia.customMediaPosition === 'top' ? 'top' : serviceWithMedia.customMediaPosition === 'bottom' ? 'bottom' : 'center' }}
                  />
                )}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-custom-primary font-semibold text-sm tracking-wider uppercase">
                <Tag className="w-4 h-4" />
                Serviço Especializado
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {serviceWithMedia.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                {serviceWithMedia.durationMinutes > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted">
                    <Clock className="w-4 h-4" />
                    Duração: {serviceWithMedia.durationMinutes} min
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-custom-primary/10 text-custom-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Disponível para agendamento
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-2xl font-bold mb-4">Sobre este serviço</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {serviceWithMedia.description || "Nenhuma descrição detalhada disponível para este serviço."}
              </p>
            </motion.div>

            <Separator className="bg-primary/5" />

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Por que escolher este serviço?</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Atendimento personalizado",
                  "Profissionais qualificados",
                  "Ambiente confortável e seguro",
                  "Materiais de primeira linha",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1 p-0.5 rounded-full bg-custom-primary/20 text-custom-primary">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Area (Price and Booking) */}
          <div className="md:col-span-4 lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-[2.5rem] border-primary/5 shadow-2xl overflow-hidden bg-white dark:bg-zinc-900 border-2">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Investimento
                    </p>
                    <div className="flex items-baseline gap-1">
                      {(() => {
                        const label = formatPriceLabel(serviceWithMedia.prices);
                        return label ? (
                          <span className="text-4xl font-black text-custom-primary">
                            {label}
                          </span>
                        ) : (
                          <span className="text-2xl font-black text-custom-primary italic">
                            Entre em contato para valores
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground">* Sujeito a alteração conforme avaliação</p>
                  </div>

                  {data.contact && (
                    <div className="space-y-4">
                      <Button
                        className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <WhatsAppButton
                          variant="custom"
                          contact={data.contact}
                          message={whatsappMessage}
                          eventName="cta_wpp_service"
                          eventLabel="service_sidebar"
                          aria-label="Agendar horário pelo WhatsApp"
                          className="flex items-center justify-center w-full h-full"
                        >
                          <Phone className="w-5 h-5 mr-3 fill-current" />
                          Agendar Horário
                        </WhatsAppButton>
                      </Button>

                      <p className="text-center text-sm text-balance text-muted-foreground px-4">
                        Seu agendamento será confirmado via WhatsApp por nossa equipe.
                      </p>
                    </div>
                  )}

                  <Separator className="bg-primary/5" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {data.avatarUrl && (
                        <div className="w-12 h-12 relative rounded-2xl overflow-hidden shadow-md">
                          <Image src={data.avatarUrl} alt={data.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Prestador</p>
                        <p className="font-bold">{data.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
