"use server";

import { revalidateTag } from "next/cache"
import { unstable_cache } from "next/cache"

export type SpotifyType = {
    images: {
        url: string
    }[],
    name: string,
    artist: string,
    preview_url: string
    uri?: string
}

export const Spotify = unstable_cache( async () => {
    try{
        const res = await fetch('https://spotify-api-flask.vercel.app/', {
            cache: 'no-cache',
            mode: 'no-cors',
            next: {
                tags: ['spotifyAPI']
            }
        })
        const data = await res.json()
        if(data.items) {
            const random = Math.floor(Math.random() * data.items.length)
            return {
                images: data.items[random].track.album.images,
                name: data.items[random].track.name,
                artist: data.items[random].track.artists[0].name,
                preview_url: data.items[random].track.preview_url,
                uri: data.items[random].track.uri
            } as SpotifyType
        }
        return {
            images: data.item.album.images,
            name: data.item.name,
            artist: data.item.artists[0].name,
            preview_url: data.item.preview_url,
            uri: data.item.uri
        } as SpotifyType
    } catch (err) {
        console.log(err)
        
    }
}, ['spotifyAPI'], {
    tags: ['spotifyAPI'],
    revalidate: 1
})

export async function getNewSong() {
    return revalidateTag('spotifyAPI')
}