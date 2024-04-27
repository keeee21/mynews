import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseString } from 'xml2js';

type RSSItem = {
  id: number;
  title: string;
  link: string;
  bookmarkCount: number;
}

type RSSResponse = {
  'rdf:RDF': {
    item: Array<{
      title: string[];
      link: string[];
      'hatena:bookmarkcount': string[];
    }>;
  };
}

export async function GET() {
  try {
    const response = await axios.get<string>('https://b.hatena.ne.jp/hotentry/it.rss');
    const xml = response.data;

    const rsss = await new Promise<RSSItem[]>((resolve, reject) => {
      parseString(xml, (err, result: RSSResponse) => {
        if (err) {
          console.error('Error parsing XML:', err);
          reject(err);
        } else {
          const items = result['rdf:RDF'].item.map((item, index) => ({
            id: index + 1,
            title: item.title[0],
            link: item.link[0],
            bookmarkCount: parseInt(item['hatena:bookmarkcount'][0], 10),
          }));
          const sortedItems = items.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
          resolve(sortedItems);
        }
      });
    });

    return new NextResponse(JSON.stringify(rsss), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching RSS data:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch RSS data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}