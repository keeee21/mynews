import { getShowInfo } from './spotifyApi';
import { isToday, removeDuplicates } from '@/app/common/service';
import { saveArticles } from '@/app/article/service';
import { spotifyChannelIds } from '@/resources/spotifyChannelList';

export async function insertPodcast() {
  try {
    const podcastShows = await Promise.all(
      spotifyChannelIds.map((showId) => getShowInfo(showId))
    );

    const episodes = podcastShows.flatMap((show) =>
      show.episodes.items.map((episode: any) => ({
        title: episode.name,
        url: episode.external_urls.spotify,
        publishedAt: new Date(episode.release_date),
      }))
    );

    const todayPodcasts = episodes.filter((podcast) =>
      isToday(podcast.publishedAt)
    );
    const uniquePodcasts = removeDuplicates(todayPodcasts, 'url');

    const savingData = uniquePodcasts.map((podcast) => ({
      title: podcast.title,
      url: podcast.url,
      publishedAt: podcast.publishedAt,
      sourceId: 1,
    }));

    await saveArticles(savingData);
  } catch (error) {
    console.error('Error fetching Podcast data:', error);
  }
}
