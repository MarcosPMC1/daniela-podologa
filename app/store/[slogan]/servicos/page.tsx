import { ServicesDetailedPage } from "@/app/components/storePage/services-detailed-page";
import { getCanonicalUrl } from "@/lib/url";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { struct } from "@/app/lib/utils"


interface Props {
  params: Promise<{ slogan: string }>;
}

export async function generateMetadata({ params }: Props): Promise<any> {

  const data = struct

  const slogan = 'podologadaniela'
  const pathname = `/store/${slogan}/servicos`;

  if (data) {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const baseUrl = getCanonicalUrl(host, "/");

    const isSubdomain = host.startsWith(`${slogan}.`);
    const allowedPlans = ['basic-plus', 'pro'];
    if (isSubdomain && (!data.plan || !allowedPlans.includes(data.plan))) {
      return { title: "Página não encontrada" };
    }

    const tenantName = data.page?.content?.header?.title || data.name;
    const title = `Serviços - ${tenantName}`;
    const description = `Confira os serviços oferecidos por ${tenantName}. Preços, descrições e agendamento online.`;

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

  return {
    title: "Serviços não encontrados",
  };
}

export default async function Page({ params }: Props) {
  const { slogan } = await params;
  const data = struct

  if (!data) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isSubdomain = host.startsWith(`${slogan}.`);

  if (isSubdomain && (!data.hasPlan)) {
    notFound();
  }

  return <ServicesDetailedPage data={data} />;
}
