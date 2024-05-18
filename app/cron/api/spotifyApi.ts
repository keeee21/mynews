import axios from 'axios';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function getSpotifyToken(): Promise<string> {
  const tokenResponse = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  });

  return tokenResponse.data.access_token;
}

export async function getShowInfo(showId: string) {
  const token = await getSpotifyToken();

  const showResponse = await axios({
    method: 'get',
    url: `https://api.spotify.com/v1/shows/${showId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return showResponse.data;
}
