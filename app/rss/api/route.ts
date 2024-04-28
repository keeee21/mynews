import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseString } from 'xml2js';
import { feedList, FLAG } from '../../../resources/feedList';

interface RSSItem {
  id: number;
  title: string;
  link: string;
  company: string;
  pubDate: string;
}

const PAGE_SIZE = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = Number(searchParams.get('start') || '0');
  const end = Number(searchParams.get('end') || PAGE_SIZE);

  const rssList: RSSItem[] = [];

  for (const { label, url, flags } of feedList.slice(start, end)) {
    try {
      const response = await axios.get<string>(url);
      const xml = response.data;

      const items = await new Promise<RSSItem[]>((resolve, reject) => {
        parseString(xml, (err, result: any) => {
          if (err) {
            console.error(`Error parsing XML for ${url}:`, err);
            reject(err);
          } else {
            let items: RSSItem[] = [];

            if (flags && flags.includes(FLAG)) {
              items = result.rss.channel[0].item.map((item: any, index: number) => ({
                id: index + 1,
                title: item.title[0],
                link: item.link[0],
                company: label,
                pubDate: item.pubDate[0],
              }));
            } else if (result.rss && result.rss.channel && result.rss.channel[0].item) {
              // RSSフィードの場合の処理
              items = result.rss.channel[0].item.map((item: any, index: number) => ({
                id: index + 1,
                title: item.title[0],
                link: typeof item.link[0] === 'string' ? item.link[0] : item.link[0]?.$.href || '',
                company: label,
                pubDate: item.pubDate[0],
              }));
            } else if (result.feed && result.feed.entry) {
              // Atomフィードの場合の処理
              items = result.feed.entry.map((item: any, index: number) => ({
                id: index + 1,
                title: item.title[0],
                link: item.link[0]?.$.href || '',
                company: label,
                pubDate: item.published[0],
              }));
            }

            resolve(items);
          }
        });
      });

      rssList.push(...items);
    } catch (error) {
      console.error(`Error fetching RSS data for ${label}:`, error);
    }
  }
  const sortedItems = rssList.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return new NextResponse(JSON.stringify(sortedItems), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}