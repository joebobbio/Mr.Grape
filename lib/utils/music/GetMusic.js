const { Util: { escapeMarkdown } } = require("discord.js");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const { getBasicInfo, getVideoID, validateURL } = require("ytdl-core");
const plRegex = /[&?]list=([^&]+)/i;

class Song {
    constructor(title, url, duration, thumbnail, author) {
        this.title = title;
        this.url = url;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.author = author;
    }
}

class SongResponse {
    constructor({ title, songs, thumbnail }) {
        this.title = title;
        this.songs = songs;
        this.thumbnail = thumbnail;
    }
}

async function getSongs(input, author) {
    if (plRegex.test(input)) {
        const res = await ytpl(input.match(plRegex)[0].slice(6));
        return new SongResponse({
            title: `**${res.items.length}** tracks from **[${escapeMarkdown(res.title)}](${res.url})**`,
            thumbnail: res.bestThumbnail.url,
            songs: res.items.map(s => new Song(s.title, s.shortUrl, s.duration, s.bestThumbnail.url, author))
        });
    }
    else {
        if (validateURL(input)) {
            const { videoDetails: res } = await getBasicInfo(getVideoID(input));
            let duration = new Date(+res.lengthSeconds * 1000).toISOString().substr(11, 8);
            duration.startsWith("00:0") ? duration = duration.slice(4) : duration.startsWith("00:") ? duration = duration.slice(3) : null;
            const song = new Song(res.title, res.video_url, duration, res.thumbnails[0].url, author);
            return new SongResponse({
                title: `**[${song.title}](${song.url})**`,
                thumbnail: song.thumbnail,
                songs: [song]
            });
        }
        else {
            input = `https://www.youtube.com/results?search_query=${encodeURIComponent(input)}&sp=EgIQAQ%253D%253D`;
            const { items } = await ytsr(input, { limit: 1 });
            const song = new Song(items[0].title, items[0].url, items[0].duration, items[0].bestThumbnail.url, author);
            return new SongResponse({
                title: `**[${song.title}](${song.url})**`,
                thumbnail: song.thumbnail,
                songs: [song]
            });
        }
    }
}

module.exports = getSongs;
