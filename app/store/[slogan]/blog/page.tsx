import { BlogDetailedPage } from "@/app/components/storePage/blog-detailed-page";
import { getCanonicalUrl } from "@/lib/url";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { struct } from "@/app/lib/utils";

interface Props {
  params: Promise<{ slogan: string }>;
}

export async function generateMetadata({ params }: Props): Promise<any> {
  const data = struct;
  const slogan = "podologadaniela";
  const pathname = `/store/${slogan}/blog`;

  if (data) {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const baseUrl = getCanonicalUrl(host, "/");

    const isSubdomain = host.startsWith(`${slogan}.`);
    if (isSubdomain && !data.hasPlan) {
      return { title: "Página não encontrada" };
    }

    const tenantName = data.page?.content?.header?.title || data.name;
    const blogTitle = data.page?.content?.blog?.title || "Blog & Notícias";
    const title = `${blogTitle} - ${tenantName}`;
    const description = `Confira as notícias, matérias na mídia, entrevistas e artigos sobre saúde dos pés de ${tenantName}.`;

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
    title: "Blog não encontrado",
  };
}

export default async function Page({ params }: Props) {
  const { slogan } = await params;
  const data = struct;

  if (!data) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isSubdomain = host.startsWith(`${slogan}.`);

  if (isSubdomain && !data.hasPlan) {
    notFound();
  }

  return <BlogDetailedPage data={data as any} />;
}
