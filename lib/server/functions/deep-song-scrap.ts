import axios from "axios";

const MakeRequest = async (song: string) => {
  const options = {
    method: "GET",
    url: "https://shazam.p.rapidapi.com/search",
    params: {
      term: song,
      locale: "en-US",
      offset: "0",
      limit: "1",
    },
    headers: {
      "X-RapidAPI-Key": process.env["RapidAPI_Key"] as string,
      "X-RapidAPI-Host": process.env["RapidAPI_Host"] as string,
    },
  };
  try {
    const response = await axios.request(options);
    const data = response.data;
    const song = data.tracks.hits[0].track.hub.actions[1].uri;
    return song;
  } catch (error) {
    console.error(error);
  }
};

export const DeepScarpSong = async (song: string) => {
  const data = await MakeRequest(song);
  return data;
};
