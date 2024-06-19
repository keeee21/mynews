import axios from 'axios';
import { parseXml, isToday, removeDuplicates } from '@/app/common/service';
import { saveArticles } from '@/app/article/service';
import type { HatebuArticle } from '@/app/common/types';

export async function insertHatebu() {
  try {
    const response = await axios.get<string>(
      'https://b.hatena.ne.jp/hotentry/it.rss'
    );
    const xml = response.data;
    const result = await parseXml<any>(xml);
    const hatebus: HatebuArticle[] = result['rdf:RDF'].item.map(
      (item: any) => ({
        title: item.title[0],
        url: item.link[0],
        publishedAt: item['dc:date'],
      })
    );

    const todayHatebus = hatebus.filter((hatebu) =>
      isToday(new Date(hatebu.publishedAt))
    );
    const uniqueHatebus = removeDuplicates(todayHatebus, 'url');

    const savingData = uniqueHatebus.map((hatebu) => ({
      title: hatebu.title,
      url: hatebu.url,
      publishedAt: new Date(hatebu.publishedAt),
      sourceId: 2,
    }));

    await saveArticles(savingData);
  } catch (error) {
    console.error('Error fetching Hatebu data:', error);
  }
}
