import { getShowInfo } from './spotifyApi';
import { removeDuplicates } from '../common/service';
import { saveArticles } from '../article/service';
import { spotifyChannelIds } from '../../resources/spotifyChannelList';

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

    const uniquePodcasts = removeDuplicates(episodes, 'url');

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
