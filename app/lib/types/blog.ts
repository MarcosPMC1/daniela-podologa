export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  url: string;
  external?: boolean;
  source?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  youtubeId?: string;
  author?: string;
  contentParagraphs?: string[];
}

export interface BlogContent {
  show?: boolean;
  order?: number;
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}
