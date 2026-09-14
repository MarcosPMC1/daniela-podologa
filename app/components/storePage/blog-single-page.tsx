"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, ChevronRight, ExternalLink, MessageCircle, Newspaper, Share2, Tag as TagIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./footer";
import { WhatsAppButton } from "./cta";
import { type BlogPost } from "@/app/lib/types/blog";

interface BlogSinglePageProps {
  data: {
    avatarUrl?: string;
    name: string;
    contact: string;
    slogan?: string;
    page?: {
      primaryColor?: string;
      secondaryColor?: string;
      backgroundColor?: string;
      content?: {
        header?: {
          title?: string;
          showLogo?: boolean;
          subtitle?: string;
        };
        blog?: {
          posts?: BlogPost[];
        };
      };
    };
  };
  postId: string;
}

export function BlogSinglePage({ data, postId }: BlogSinglePageProps) {
  const primaryColor = data.page?.primaryColor || "#0a9900";
  const secondaryColor = data.page?.secondaryColor || "#2ed5ff";
  const slogan = data.slogan || "podologadaniela";
  const posts: BlogPost[] = data.page?.content?.blog?.posts ?? [];

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center p-4">
        <Newspaper className="w-16 h-16 opacity-40 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Postagem não encontrada</h1>
        <p className="text-muted-foreground">A postagem procurada não existe ou foi removida.</p>
        <Link href={`/store/${slogan}/blog`}>
          <Button style={{ backgroundColor: primaryColor, color: "#ffffff" }}>
            Voltar para o Blog
          </Button>
        </Link>
      </div>
    );
  }

  const otherPosts = posts.filter((p) => p.id !== post.id);
  const contact = data.contact ? data.contact.replace(/\D/g, "") : "5519981150218";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${contact}&text=Olá!%20Li%20a%20matéria%20"${encodeURIComponent(post.title)}"%20no%20site%20e%20gostaria%20de%20agendar%20um%20atendimento.`;

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-background text-foreground"
      style={
        {
          "--custom-primary": primaryColor,
          "--custom-secondary": secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* HEADER */}
      <header role="banner" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-8 lg:px-16 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {data.avatarUrl && (
              <Link href={`/store/${slogan}`} className="w-9 h-9 relative rounded-lg overflow-hidden shadow-sm shrink-0">
                <Image
                  src={data.avatarUrl}
                  alt={`Logo de ${data.name}`}
                  width={36}
                  height={36}
                  sizes="36px"
                  className="object-cover"
                />
              </Link>
            )}
            <div className="flex flex-col">
              <Link href={`/store/${slogan}`} className="font-semibold text-lg leading-none hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
                {data.page?.content?.header?.title ?? data.name}
              </Link>
              <span className="text-xs text-muted-foreground mt-0.5">Blog & Notícias</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href={`/store/${slogan}/blog`}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Blog</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-16 py-10 md:py-16 max-w-4xl mx-auto space-y-8">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link href={`/store/${slogan}`} className="hover:text-foreground transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/store/${slogan}/blog`} className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* POST HEADER */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {post.category && (
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {post.category}
              </span>
            )}
            {post.source && (
              <span className="text-xs uppercase font-medium tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {post.source}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* META INFO */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2 border-y border-border/40 py-3">
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" style={{ color: primaryColor }} />
                <span>Por <strong className="text-foreground font-semibold">{post.author}</strong></span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            )}
          </div>
        </div>

        {/* MEDIA EMBED OR COVER IMAGE */}
        {post.youtubeId ? (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${post.youtubeId}?autoplay=0&rel=0`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          post.coverImage && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                unoptimized={post.coverImage.includes("youtube.com") || post.coverImage.includes("ytimg.com")}
              />
            </div>
          )
        )}

        {/* RESUMO / LEAD */}
        <div
          className="p-6 rounded-2xl border-l-4 text-base sm:text-lg font-medium leading-relaxed bg-muted/40 shadow-sm"
          style={{ borderColor: primaryColor }}
        >
          {post.summary}
        </div>

        {/* CONTEÚDO EM PARÁGRAFOS */}
        {post.contentParagraphs && post.contentParagraphs.length > 0 ? (
          <div className="prose dark:prose-invert max-w-none space-y-4 text-base sm:text-lg leading-relaxed text-foreground/90">
            {post.contentParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : null}

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-4 border-t border-border/40">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Assuntos relacionados
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  <TagIcon className="w-3.5 h-3.5 opacity-70" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CAIXA DE AÇÃO / CTA WHATSAPP & LINK EXTERNO */}
        <Card className="rounded-3xl border-0 shadow-xl ring-1 ring-black/10 overflow-hidden" style={{ backgroundColor: `${primaryColor}0d` }}>
          <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold" style={{ color: primaryColor }}>
                Precisa de cuidados com os pés?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Agende sua avaliação podológica diretamente com a Podóloga Daniela Novelli em Santa Bárbara D'Oeste.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full font-semibold gap-2 shadow-lg" style={{ backgroundColor: primaryColor, color: "#ffffff" }}>
                  <MessageCircle className="w-4 h-4" />
                  <span>Agendar no WhatsApp</span>
                </Button>
              </a>
              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <span>Matéria original</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OUTRAS POSTAGENS RELACIONADAS */}
        {otherPosts.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Outras Notícias & Artigos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherPosts.map((op) => (
                <Card key={op.id} className="rounded-2xl border-0 ring-1 ring-black/10 overflow-hidden hover:shadow-lg transition-all group">
                  <CardContent className="p-5 space-y-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>
                      {op.category || "Blog"}
                    </span>
                    <h4 className="font-bold text-base leading-snug group-hover:opacity-80 transition-opacity">
                      <Link href={`/store/${slogan}/blog/${op.id}`}>
                        {op.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {op.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton contact={data.contact} />
    </div>
  );
}
