import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { LocationMap } from "./location-map";

interface LocationSectionProps {
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
    location?: {
      embedLink?: string;
      title?: string;
    };
    header?: {
      title?: string;
    };
  };
  primaryColor?: string;
  _bgContrast?: "white" | "black";
}

export function LocationSection({
  data,
  content,
  primaryColor = "#0a9900",
}: LocationSectionProps) {
  if (!content?.location?.embedLink || !data.street_name) return null;
  return (
    <section
      className="w-full px-4 sm:px-8 lg:px-16 py-16 lg:py-24"
      aria-label="Localização"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="p-2.5 rounded-2xl"
            style={{ backgroundColor: primaryColor + "22" }}
          >
            <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-3xl font-bold">
            {content.location.title ?? "Nossa Localização"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/10 h-80 lg:h-[420px] bg-zinc-100">
            <LocationMap
              embedLink={content.location.embedLink}
              title={content?.header?.title ?? data.name}
            />
          </div>

          {/* Address card */}
          <Card className="rounded-3xl shadow-xl border-0 ring-1 ring-black/10 h-full">
            <CardContent className="p-8 flex flex-col justify-between h-full gap-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: primaryColor }}>
                  Endereço
                </p>
                <address className="not-italic space-y-1">
                  <p className="text-2xl font-bold leading-snug">
                    {data.street_name}, {data.address_number}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {data.neighborhood}, {data.city} – {data.state}
                  </p>
                  <p className="text-base font-mono text-muted-foreground">
                    {data.postal_code}
                  </p>
                </address>
              </div>

              <Button
                size="lg"
                className="w-full rounded-2xl font-semibold text-base"
                style={{ backgroundColor: primaryColor }}
              >
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${data.street_name}, ${data.address_number}, ${data.city} - ${data.state}`
                  )}`}
                  target="_blank"
                  aria-label="Abrir rota no Google Maps"
                >
                  <MapPin className="mr-2 w-5 h-5" />
                  Abrir mapa e traçar rota
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
