"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, ExternalLink, Newspaper, Search, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "./footer";
import { WhatsAppButton } from "./cta";
import { type BlogPost } from "@/app/lib/types/blog";

interface BlogDetailedPageProps {
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
          show?: boolean;
          title?: string;
          subtitle?: string;
          posts?: BlogPost[];
        };
      };
    };
  };
}

export function BlogDetailedPage({ data }: BlogDetailedPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const primaryColor = data.page?.primaryColor || "#0a9900";
  const secondaryColor = data.page?.secondaryColor || "#2ed5ff";
  const slogan = data.slogan || "podologadaniela";
  const blog = data.page?.content?.blog;
  const posts: BlogPost[] = blog?.posts ?? [];

  // Categorias únicas para filtro
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );

  // Filtragem dos posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === "todos" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
              href={`/store/${slogan}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao início</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-16 py-10 md:py-16 max-w-7xl mx-auto space-y-10">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/store/${slogan}`} className="hover:text-foreground transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">Blog & Notícias</span>
        </nav>

        {/* HERO HEADER DA SUBPÁGINA */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${primaryColor}1f`, color: primaryColor }}>
            <Newspaper className="w-4 h-4" />
            <span>Notícias, Artigos & Mídia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
            {blog?.title || "Blog & Notícias"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {blog?.subtitle || "Acompanhe matérias, entrevistas, podcasts e dicas sobre saúde dos pés, podologia preventiva e qualidade de vida."}
          </p>
        </div>

        {/* BARRA DE PESQUISA E FILTROS DE CATEGORIA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
          {/* Pesquisa */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artigos ou temas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Filtros de Categoria */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedCategory === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("todos")}
                className="rounded-full text-xs"
                style={selectedCategory === "todos" ? { backgroundColor: primaryColor, color: "#ffffff" } : {}}
              >
                Todos ({posts.length})
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full text-xs"
                  style={selectedCategory === cat ? { backgroundColor: primaryColor, color: "#ffffff" } : {}}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator style={{ backgroundColor: secondaryColor, opacity: 0.2 }} />

        {/* LISTA DE POSTS */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Newspaper className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold">Nenhuma postagem encontrada</h3>
            <p className="text-muted-foreground">Tente alterar os termos da busca ou selecionar outra categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="group h-full rounded-3xl shadow-md hover:shadow-2xl border-0 ring-1 ring-black/10 dark:ring-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 bg-card">
                  {/* Capa */}
                  {post.coverImage && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={post.coverImage.includes("youtube.com") || post.coverImage.includes("ytimg.com")}
                      />
                      {post.category && (
                        <span
                          className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full text-white backdrop-blur-md shadow-md"
                          style={{ backgroundColor: `${primaryColor}ee` }}
                        >
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Conteúdo */}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta Data */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        {post.source && (
                          <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-muted/60">
                            {post.source}
                          </span>
                        )}
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        )}
                      </div>

                      {/* Título */}
                      <h2 className="text-xl font-bold leading-tight group-hover:text-[var(--custom-primary)] transition-colors">
                        <Link href={`/store/${slogan}/blog/${post.id}`} className="outline-none focus:underline">
                          {post.title}
                        </Link>
                      </h2>

                      {/* Resumo */}
                      <p className="text-sm line-clamp-3 leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 space-y-3">
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/80"
                            >
                              <TagIcon className="w-3 h-3 opacity-60" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Link de Navegação Interno + Externo */}
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href={`/store/${slogan}/blog/${post.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-all"
                          style={{ color: primaryColor }}
                        >
                          <span>Ler post completo</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                            title="Abrir matéria original externa"
                          >
                            <span>Link externo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton contact={data.contact} />
    </div>
  );
}
