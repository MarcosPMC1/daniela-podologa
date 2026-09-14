"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ExternalLink, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type BlogContent, type BlogPost } from "@/app/lib/types/blog";

interface BlogComponentProps {
  content?: {
    blog?: BlogContent;
  };
  data?: {
    slogan?: string;
  };
  primaryColor?: string;
  mutedTextColor?: string;
}

export function BlogSection({
  content,
  data,
  primaryColor = "#0a9900",
  mutedTextColor = "text-muted-foreground",
}: BlogComponentProps) {
  const blog = content?.blog;
  const posts: BlogPost[] = blog?.posts ?? [];
  const slogan = data?.slogan || "podologadaniela";

  if (blog?.show === false || posts.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 py-16 lg:py-24" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Link to Subpage */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Link href={`/store/${slogan}/blog`} className="inline-block group">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2.5 rounded-2xl shrink-0"
                  style={{ backgroundColor: `${primaryColor}1f` }}
                >
                  <Newspaper className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <h2
                  id="blog-heading"
                  className="text-3xl font-bold tracking-tight flex items-center gap-2"
                  style={{ color: primaryColor }}
                >
                  {blog?.title || "Blog & Notícias"}
                  <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
              </div>
            </Link>
            {blog?.subtitle && (
              <p className={`text-base sm:text-lg max-w-2xl ${mutedTextColor}`}>
                {blog.subtitle}
              </p>
            )}
          </div>

          <Link
            href={`/store/${slogan}/blog`}
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity shrink-0"
            style={{ color: primaryColor }}
          >
            <span>Ver todas as notícias</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const internalUrl = `/store/${slogan}/blog/${post.id}`;
            const isExternal = post.external !== false;

            return (
              <Card
                key={post.id}
                className="group rounded-3xl shadow-lg border-0 ring-1 ring-black/10 dark:ring-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card"
              >
                {/* Cover Image Container */}
                {post.coverImage && (
                  <Link href={internalUrl} className="relative w-full aspect-[16/9] overflow-hidden bg-muted block">
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
                  </Link>
                )}

                {/* Content */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Meta (Source & Date) */}
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

                    {/* Title */}
                    <h3 className="text-xl font-bold leading-tight group-hover:text-[var(--custom-primary)] transition-colors">
                      <Link href={internalUrl} className="outline-none focus:underline">
                        {post.title}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className={`text-sm line-clamp-3 leading-relaxed ${mutedTextColor}`}>
                      {post.summary}
                    </p>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-4 border-t border-border/40 space-y-3">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/80"
                          >
                            <Tag className="w-3 h-3 opacity-60" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Internal & External Links */}
                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={internalUrl}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-all"
                        style={{ color: primaryColor }}
                      >
                        <span>Ver post</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                      {post.url && isExternal && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          title="Abrir matéria no site de origem"
                        >
                          <span>Fonte</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
