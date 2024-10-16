import { Buffer } from 'buffer';

const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const refresh_token = process.env.REACT_APP_REFRESH_TOKEN;

const token_endpoint = 'https://accounts.spotify.com/api/token';
const currently_playing_endpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAccessToken = async () => {
  const authParameters = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  }

  const response = await fetch(token_endpoint, authParameters);

  return response.json();
}

const { access_token } = await getAccessToken();

export const getCurrentSong = async () => {
  return fetch(currently_playing_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export default async function getCurrentSongData() {
  const response = await getCurrentSong();

  if (response.status === 204 || response.status > 400) {
    return false;
  }

  const song = await response.json();
  const songItem = song.item;

  const isPlaying = song.is_playing;

  const title = songItem.name;
  const artist = songItem.artists.map((_artist) => _artist.name).join(", ");

  const albumImageUrl = songItem.album.images[0].url;
  const songUrl = songItem.external_urls.spotify;

  const trackProgress = Math.floor(song.progress_ms / 1000);
  const trackLength = Math.floor(songItem.duration_ms / 1000);

  return {
    isPlaying,
    title,
    artist,
    albumImageUrl,
    songUrl,
    trackProgress,
    trackLength
  };
}