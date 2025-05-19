'use server';

import { AxiosError } from 'axios';
// @ts-ignore
import { getLyrics as GetLyric } from 'genius-lyrics-api';
import { unstable_cache } from 'next/cache';
import { DeepScarpSong } from './deep-song-scrap';

export type SpotifyType = {
  images: { url: string }[];
  name: string;
  artist: string;
  preview_url: string;
  uri?: string;
  status: 'now-playing' | 'shuffle';
  lyrics: string;
};

const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'];
const SPOTIFY_SECRET_ID = process.env['SPOTIFY_SECRET_ID'];
const SPOTIFY_REFRESH_TOKEN = process.env['SPOTIFY_REFRESH_TOKEN'];

const NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYING_URL = `https://api.spotify.com/v1/playlists/42h3IewUsTfRNHE5Puw9EK/tracks?limit=50&offset=${Math.floor(Math.random() * 1900)}`;
const REFRESH_TOKEN_URL = 'https://accounts.spotify.com/api/token';

let SPOTIFY_TOKEN = '';

const getAuthHeader = () => {
  const authString = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_SECRET_ID}`;
  return Buffer.from(authString).toString('base64');
};

const requestRefreshToken = async (): Promise<string | undefined> => {
  const data = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: SPOTIFY_REFRESH_TOKEN as string,
  });

  const headers = {
    Authorization: `Basic ${getAuthHeader()}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: 'POST',
      headers,
      body: data,
    });

    if (response.ok) {
      const resp = await response.json();
      return resp.access_token;
    } else {
      console.error('Failed to refresh token:', response.statusText);
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

const makeRequest = async (url: string): Promise<any> => {
  if (!SPOTIFY_TOKEN) {
    SPOTIFY_TOKEN = (await requestRefreshToken()) || '';
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
      next: { revalidate: 1 },
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      // Token might be expired, refresh and try again
      SPOTIFY_TOKEN = (await requestRefreshToken()) || '';
      return makeRequest(url);
    } else {
      console.error('Spotify API error:', response.statusText);
    }
  } catch (error) {
    console.log('Error making request:', error);
  }
};

export const getLyrics = async (
  song: string,
  artist: string,
): Promise<string> => {
  const options = {
    apiKey: process.env['GENIUS_ACCESS_TOKEN'] as string,
    title: song,
    artist,
    optimizeQuery: true,
  };

  try {
    return await GetLyric(options);
  } catch (error: unknown) {
    console.error('Error fetching lyrics:', error);
    return 'Error fetching lyrics';
  }
};

export const getDeepScrapedSong = async (song: string): Promise<string> => {
  return await DeepScarpSong(song);
};

const extractSongData = async (
  item: any,
  status: 'now-playing' | 'shuffle',
): Promise<SpotifyType> => {
  const name = item.name;
  const artist = item.artists[0].name;
  const previewUrl =
    item.preview_url || (await getDeepScrapedSong(`${name} ${artist}`));

  return {
    status,
    images: item.album.images,
    name,
    artist,
    preview_url: previewUrl,
    uri: item.uri,
    // lyrics: await getLyrics(name, artist),
    lyrics: ""
  };
};

export const getNowPlaying = async () => {
  const data = await makeRequest(NOW_PLAYING_URL);

  if (data?.item) {
    return extractSongData(data.item, 'now-playing') as unknown as SpotifyType;
  } else {
    return Error('Sorry, Meer is not playing currently :(');
  }
};

export const getRecentlyPlayed = async (): Promise<SpotifyType | undefined> => {
  const data = await makeRequest(RECENTLY_PLAYING_URL);

  if (data?.items) {
    const randomItem =
      data.items[Math.floor(Math.random() * data.items.length)];
    return extractSongData(randomItem.track, 'shuffle');
  }
};

export const SpotifySelfApi = async (
  status: 'shuffle' | 'now-playing',
): Promise<SpotifyType | undefined> => {
  try {
    if (status === 'shuffle') {
      return await getRecentlyPlayed();
    }
    if (status === 'now-playing') {
      return (await getNowPlaying()) as unknown as SpotifyType;
    }
  } catch (error) {
    console.error(`Error fetching ${status} data:`, error);
  }
};

export const SpotifyNowPlaying = unstable_cache(
  async () => {
    try {
      return await getNowPlaying();
    } catch (error) {
      console.error('Error fetching now playing:', error);
    }
  },
  ['spotifyNowPlaying'],
  { revalidate: 1 },
);

export const SpotifyRecentlyPlayed = unstable_cache(
  async () => {
    try {
      return await getRecentlyPlayed();
    } catch (error) {
      console.error('Error fetching recently played:', error);
    }
  },
  ['spotifyRecentlyPlayed'],
  { revalidate: 1 },
);
