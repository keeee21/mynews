export type HatebuArticle = {
  title: string;
  url: string;
  publishedAt: string;
};

export type RssArticle = {
  title: string;
  link: string;
  company: string;
  pubDate: string;
};

export type Article = {
  title: string;
  url: string;
  publishedAt: Date;
  sourceId: number;
};
