import axios from 'axios';
import { parseString } from 'xml2js';
import { PrismaClient } from '@prisma/client';
import { feedList, FLAG } from 'resources/feedList';
import { getShowInfo } from './spotifyApi';

const prisma = new PrismaClient();

// はてなを取得してくる
export async function insertHatebu() {
  type RawItem = {
    id: number;
    title: string;
    url: string;
    publishedAt: string;
  };

  const response = await axios.get<string>(
    'https://b.hatena.ne.jp/hotentry/it.rss'
  );
  const xml = response.data;
  const hatebus = await new Promise<RawItem[]>((resolve, reject) => {
    parseString(xml, (err, result: any) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(err);
      } else {
        const items = result['rdf:RDF'].item.map((item: any) => ({
          title: item.title[0],
          url: item.link[0],
          publishedAt: item['dc:date'],
        }));
        resolve(items);
      }
    });
  });

  // [dc:date]が、今日のものだけにフィルターする
  const todayHatebus = hatebus.filter((hatebu) => {
    const date = new Date(hatebu.publishedAt);
    return date.toDateString() === new Date().toDateString();
  });

  if (todayHatebus.length > 0) {
    // 今日公開されたものだけを保存する
    const savingData = todayHatebus.map((hatebu) => ({
      title: hatebu.title,
      url: hatebu.url,
      publishedAt: new Date(hatebu.publishedAt),
      sourceId: 2,
    }));

    await prisma.article.createMany({
      data: savingData,
    });
  }
}

// rssを取得してくる
export async function insertRss() {
  interface RssItem {
    id: number;
    title: string;
    link: string;
    company: string;
    pubDate: string;
  }

  const rssList: RssItem[] = [];
  const PAGE_SIZE = 10;
  const start = 0;
  const end = PAGE_SIZE;

  //rssを取得してくる
  for (const { label, url, flags } of feedList.slice(start, end)) {
    try {
      const response = await axios.get<string>(url);
      const xml = response.data;

      const items = await new Promise<RssItem[]>((resolve, reject) => {
        parseString(xml, (err, result: any) => {
          if (err) {
            console.error(`Error parsing XML for ${url}:`, err);
            reject(err);
          } else {
            let items: RssItem[] = [];

            if (flags && flags.includes(FLAG)) {
              items = result.rss.channel[0].item.map((item: any) => ({
                title: item.title[0],
                link: item.link[0],
                company: label,
                pubDate: item.pubDate[0],
              }));
            } else if (
              result.rss &&
              result.rss.channel &&
              result.rss.channel[0].item
            ) {
              // RSSフィードの場合の処理
              items = result.rss.channel[0].item.map((item: any) => ({
                title: item.title[0],
                link:
                  typeof item.link[0] === 'string'
                    ? item.link[0]
                    : item.link[0]?.$.href || '',
                company: label,
                pubDate: item.pubDate[0],
              }));
            } else if (result.feed && result.feed.entry) {
              // Atomフィードの場合の処理
              items = result.feed.entry.map((item: any) => ({
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

    // [pubDate]が、今日のものだけにフィルターする
    const todayRss = rssList.filter((rss) => {
      const date = new Date(rss.pubDate);
      return date.toDateString() === new Date().toDateString();
    });

    if (todayRss.length > 0) {
      // 今日公開されたものだけを保存する
      const savingData = todayRss.map((rss) => ({
        title: rss.title,
        url: rss.link,
        publishedAt: new Date(rss.pubDate),
        sourceId: 3,
      }));

      await prisma.article.createMany({
        data: savingData,
      });
    }
  }
}

// spotifyのpodcastを取得してくる
export async function insertPodcast() {
  const spotifyChannelIds = [
    '0EVGGZqraiaYdCo6hlVBfN', //CULTIBASE RADIO
    '32qgIhAHYnseWxiGyrFzSt', //ゆるコンピュータ科学ラジオ
  ];

  const podcastShows = await Promise.all(
    spotifyChannelIds.map(async (showId) => {
      return await getShowInfo(showId);
    })
  );

  const items = podcastShows.flatMap((show) => {
    return show.episodes.items
      .map((episode: any) => {
        const releaseDate = episode.release_date;

        if (!releaseDate) {
          console.warn(
            `Release date not available for episode: ${episode.name}`
          );
          return [];
        }

        return [
          {
            title: episode.name,
            url: episode.external_urls.spotify,
            publishedAt: new Date(releaseDate),
          },
        ];
      })
      .flat();
  });

  const todayPodcasts = items.filter((podcast) => {
    const date = new Date(podcast.publishedAt);
    return date.toDateString() === new Date().toDateString();
  });

  if (todayPodcasts.length > 0) {
    const savingData = todayPodcasts.map((podcast) => ({
      title: podcast.title,
      url: podcast.url,
      publishedAt: podcast.publishedAt,
      sourceId: 1,
    }));

    await prisma.article.createMany({
      data: savingData,
    });
  }
}
