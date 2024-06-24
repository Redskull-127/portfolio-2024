"use server";

import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { DeepScarpSong } from "./deep-song-scrap";

export type SpotifyType = {
  images: {
    url: string;
  }[];
  name: string;
  artist: string;
  preview_url: string;
  uri?: string;
  status: "now-playing" | "shuffle";
};

const SPOTIFY_CLIENT_ID = process.env["SPOTIFY_CLIENT_ID"];
const SPOTIFY_SECRET_ID = process.env["SPOTIFY_SECRET_ID"];
const SPOTIFY_REFRESH_TOKEN = process.env["SPOTIFY_REFRESH_TOKEN"];
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYING_URL = `https://api.spotify.com/v1/playlists/42h3IewUsTfRNHE5Puw9EK/tracks?limit=50&offset=${Math.floor(
  Math.random() * 951,
)}`;
const REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token";

let SPOTIFY_TOKEN = "";

const getAuthHeader = () => {
  const authString = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_SECRET_ID}`;
  return Buffer.from(authString).toString("base64");
};

const requestRefreshToken = async () => {
  const data = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: SPOTIFY_REFRESH_TOKEN as string,
  });

  const headers = {
    Authorization: `Basic ${getAuthHeader()}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers,
      next: {
        tags: ["spotifyAPI"],
        revalidate: 1,
      },
      body: data,
    });
    const resp = response !== undefined && (await response.json());
    return resp.access_token;
  } catch (error) {
    // Handle error
  }
};

export const makeRequest = async (url: string, config = {}): Promise<any> => {
  if (!SPOTIFY_TOKEN) {
    SPOTIFY_TOKEN = await requestRefreshToken();
  }

  try {
    const makeResponse = await fetch(url, {
      // ...config,
      headers: {
        Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      },
      next: {
        tags: ["spotifyAPI"],
        revalidate: 1,
      },
    });
    const res = makeResponse && (await makeResponse.json());

    return res;
  } catch (error: any) {
    if (error.response?.status === 401) {
      SPOTIFY_TOKEN = await requestRefreshToken();
      return makeRequest(url);
    }
  }
};

export async function getNewSong() {
  return revalidateTag("spotifyAPI");
}

export const getNowPlaying = async () => {
  const data = await makeRequest(NOW_PLAYING_URL);
  if (data.item) {
    if (data.item.preview_url === null) {
      const preview = await DeepScarpSong(
        `${data.item.name} ${data.item.artists[0].name}`,
      );
      return {
        status: "now-playing",
        images: data.item.album.images,
        name: data.item.name,
        artist: data.item.artists[0].name,
        preview_url: preview,
        uri: data.item.uri,
      } as unknown as SpotifyType;
    }
    return {
      status: "now-playing",
      images: data.item.album.images,
      name: data.item.name,
      artist: data.item.artists[0].name,
      preview_url: data.item.preview_url,
      uri: data.item.uri,
    } as unknown as SpotifyType;
  } else {
    return Error("Not Playing");
  }
};

export const getRecentlyPlayed = async () => {
  const data = await makeRequest(RECENTLY_PLAYING_URL);
  if (data.items) {
    const random = Math.floor(Math.random() * data.items.length);
    if (data.items[random].track.preview_url === null) {
      const preview = await DeepScarpSong(
        `${data.items[random].track.name} ${data.items[random].track.artists[0].name}`,
      );
      return {
        status: "shuffle",
        images: data.items[random].track.album.images,
        name: data.items[random].track.name,
        artist: data.items[random].track.artists[0].name,
        preview_url: preview,
        uri: data.items[random].track.uri,
      } as unknown as SpotifyType;
    }
    return {
      status: "shuffle",
      images: data.items[random].track.album.images,
      name: data.items[random].track.name,
      artist: data.items[random].track.artists[0].name,
      preview_url: data.items[random].track.preview_url,
      uri: data.items[random].track.uri,
    } as unknown as SpotifyType;
  } else {
    return Error("Not Playing");
  }
};

export const SpotifySelfApi = unstable_cache(
  async () => {
    try {
      return await getNowPlaying();
    } catch (error) {
      try {
        return await getRecentlyPlayed();
      } catch (innerError) {
        console.log(innerError);
      }
    }
  },
  ["spotifyAPI"],
  {
    tags: ["spotifyAPI"],
    revalidate: 1,
  },
);
