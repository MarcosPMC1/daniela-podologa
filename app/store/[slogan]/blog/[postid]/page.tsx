import { BlogSinglePage } from "@/app/components/storePage/blog-single-page";
import { getCanonicalUrl } from "@/lib/url";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { struct } from "@/app/lib/utils";
import { type BlogPost } from "@/app/lib/types/blog";

interface Props {
  params: Promise<{ slogan: string; postid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<any> {
  const { postid } = await params;
  const data = struct;
  const slogan = "podologadaniela";
  const pathname = `/store/${slogan}/blog/${postid}`;

  if (data) {
    const posts: BlogPost[] = data.page?.content?.blog?.posts ?? [];
    const post = posts.find((p) => p.id === postid);

    if (!post) {
      return { title: "Postagem não encontrada" };
    }

    const headersList = await headers();
    const host = headersList.get("host") || "";
    const baseUrl = getCanonicalUrl(host, "/");

    const tenantName = data.page?.content?.header?.title || data.name;
    const title = `${post.title} - ${tenantName}`;
    const description = post.summary;

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
        images: [post.coverImage || data.avatarUrl || "/og-image.jpg"],
        type: "article",
      },
      icons: {
        icon: data.avatarUrl || "/favicon.ico",
      },
    };
  }

  return {
    title: "Postagem não encontrada",
  };
}

export default async function Page({ params }: Props) {
  const { slogan, postid } = await params;
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

  const posts: BlogPost[] = data.page?.content?.blog?.posts ?? [];
  const postExists = posts.some((p) => p.id === postid);

  if (!postExists) {
    notFound();
  }

  return <BlogSinglePage data={data as any} postId={postid} />;
}
