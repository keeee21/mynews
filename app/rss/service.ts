import axios from 'axios';
import { parseXml, isToday, removeDuplicates } from '@/app/common/service';
import { saveArticles } from '@/app/article/service';
import type { RssArticle } from '@/app/common/types';
import { feedList, FLAG } from '@/resources/feedList';

export async function insertRss() {
  const rssArticles: RssArticle[] = [];
  const PAGE_SIZE = 10;
  const start = 0;
  const end = PAGE_SIZE;

  for (const { label, url, flags } of feedList.slice(start, end)) {
    try {
      const response = await axios.get<string>(url);
      const xml = response.data;
      const result = await parseXml<any>(xml);

      let items: RssArticle[] = [];

      if (flags?.includes(FLAG) && result.rss?.channel?.[0]?.item) {
        items = result.rss.channel[0].item.map((item: any) => ({
          title: item.title[0],
          link: item.link[0],
          company: label,
          pubDate: item.pubDate[0],
        }));
      } else if (result.feed?.entry) {
        items = result.feed.entry.map((item: any) => ({
          title: item.title[0],
          link: item.link[0]?.$.href || '',
          company: label,
          pubDate: item.published[0],
        }));
      }

      rssArticles.push(...items);
    } catch (error) {
      console.error(`Error fetching RSS data for ${label}:`, error);
    }
  }

  const todayRss = rssArticles.filter((rss) => isToday(new Date(rss.pubDate)));
  const uniqueRss = removeDuplicates(todayRss, 'link');

  const savingData = uniqueRss.map((rss) => ({
    title: rss.title,
    url: rss.link,
    publishedAt: new Date(rss.pubDate),
    sourceId: 3,
  }));

  await saveArticles(savingData);
}
