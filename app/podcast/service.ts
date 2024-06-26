import { getShowEpisodes } from './spotifyApi';
import { isToday, removeDuplicates } from '@/app/common/service';
import { saveArticles, getExistingEpisodeUrls } from '@/app/article/service';
import { spotifyChannelIds } from '@/resources/spotifyChannelList';
import { ARTICLE_SOURCES } from '@/consts/articleSouece';

export async function insertPodcast() {
  try {
    const existingEpisodeUrls = await getExistingEpisodeUrls();

    const podcastEpisodes = await Promise.all(
      spotifyChannelIds.map((showId) => getShowEpisodes(showId))
    );

    const episodes = podcastEpisodes.flatMap((episodes) =>
      episodes.map((episode: any) => ({
        title: episode.name,
        url: episode.external_urls.spotify,
        publishedAt: new Date(episode.release_date),
      }))
    );

    const newEpisodes = episodes.filter(
      (episode) => !existingEpisodeUrls.includes(episode.url)
    );

    const todayPodcasts = newEpisodes.filter((podcast) =>
      isToday(podcast.publishedAt)
    );
    const uniquePodcasts = removeDuplicates(todayPodcasts, 'url');

    const savingData = uniquePodcasts.map((podcast) => ({
      title: podcast.title,
      url: podcast.url,
      publishedAt: podcast.publishedAt,
      sourceId: ARTICLE_SOURCES.PODCAST.id,
    }));

    await saveArticles(savingData);
  } catch (error) {
    console.error('Error fetching Podcast data:', error);
  }
}
