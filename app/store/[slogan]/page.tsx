import { struct } from "@/app/lib/utils";
import TenantPage from "@/app/components/storePage/store-page";
import { getCanonicalUrl } from "@/lib/url";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slogan: string }>;
}

export async function generateMetadata({ params }: Props): Promise<any> {
  const { slogan } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const baseUrl = getCanonicalUrl(host, "/");
  const pathname = `/store/${slogan}`;

  const data = struct

  if (data) {
    const isSubdomain = host.startsWith(`${slogan}.`);
    const allowedPlans = data.hasSubdomain;
    if (isSubdomain && (!data.hasPlan || !allowedPlans)) {
      return { title: "Página não encontrada" };
    }

    const tenantName = data.page?.content?.header?.title || data.name;
    const tenantDescription = data.page?.content?.about?.description || data.slogan;

    return {
      applicationName: tenantName,
      metadataBase: new URL(baseUrl),
      title: {
        absolute: tenantName,
      },
      description: tenantDescription,
      alternates: {
        canonical: getCanonicalUrl(host, pathname),
      },
      openGraph: {
        title: tenantName,
        description: tenantDescription,
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
    title: "Loja não encontrada",
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
  const allowedPlans = data.hasSubdomain;

  if (isSubdomain && (!data.hasPlan || !allowedPlans)) {
    notFound();
  }

  return <TenantPage data={data} />;
}
