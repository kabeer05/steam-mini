import { ResponseRecentlyPlayed, ResponseTopGames } from './types/SteamMini'

function filterRecent(game): ResponseRecentlyPlayed {
    return {
        appid: game.appid,
        name: game.name,
        image: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        url: `https://store.steampowered.com/app/${game.appid}`
    }
}

function filterTop(game): ResponseTopGames {
    return {
        appid: game.appid,
        name: game.name,
        image: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        url: `https://store.steampowered.com/app/${game.appid}`,
        playtime: game.playtime_forever
    }
}

export {
    filterRecent,
    filterTop
}