export type SpotifyType = {
    images: {
        url: string
    }[],
    name: string,
    artist: string,
    preview_url: string
    error: string
}

export async function Spotify() {
    try{
        const res = await fetch('https://spotify-api-flask.vercel.app/', {
            cache: 'no-cache',
        })
        const data = await res.json()
        if(data.items) {
            const random = Math.floor(Math.random() * data.items.length)
            return {
                images: data.items[random].track.album.images,
                name: data.items[random].track.name,
                artist: data.items[random].track.artists[0].name,
                preview_url: data.items[random].track.preview_url,
            } as SpotifyType
        }
        return {
            images: data.item.album.images,
            name: data.item.name,
            artist: data.item.artists[0].name,
            preview_url: data.item.preview_url,
        } as SpotifyType
    } catch (err) {
        console.log(err)
        return new Error('Something went wrong')
    }
}