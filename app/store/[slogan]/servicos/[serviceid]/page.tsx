import { struct } from "@/app/lib/utils";
import { ServiceSinglePage } from "@/app/components/storePage/service-single-page";
import { getCanonicalUrl } from "@/lib/url";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slogan: string; serviceid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<any> {
  const { serviceid } = await params;
  const data = struct

  if (data) {
    const service = (data.services ?? []).find((s: any) => s.id === serviceid && s.isactive);
    const tenantName = data.page?.content?.header?.title || data.name;

    const headersList = await headers();
    const host = headersList.get("host") || "";
    const baseUrl = getCanonicalUrl(host, "/");
    const pathname = `/store/podologadaniela/servicos/${serviceid}`;



    if (service) {
      const title = `${service.name} - ${tenantName}`;
      const description = service.description || `Confira detalhes sobre ${service.name} em ${tenantName}.`;

      return {
        applicationName: tenantName,
        metadataBase: new URL(baseUrl),
        title: {
          absolute: title,
        },
        description: description,
        alternates: {
          canonical: getCanonicalUrl(host, pathname),
        },
        openGraph: {
          title: title,
          description: description,
          siteName: tenantName,
          images: [data.avatarUrl || "/og-image.jpg"],
          type: "website",
        },
        icons: {
          icon: data.avatarUrl || "/favicon.ico",
        },
      };
    }
  }

  return {
    title: "Serviço não encontrado",
  };
}

export default async function Page({ params }: Props) {
  const { serviceid } = await params;
  const data = struct

  if (!data) {
    notFound();
  }

  const service = (data.services ?? []).find((s: any) => s.id === serviceid && s.isactive);

  if (!service) {
    notFound();
  }

  return <ServiceSinglePage data={data} service={service} />;
}
