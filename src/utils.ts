import { ResponseRecentlyPlayed } from './types/SteamMini'

function filterRecent(game): ResponseRecentlyPlayed {
    return {
        appid: game.appid,
        name: game.name,
        image: `https://media.steampowered.com/steamcommunity/public/images/apps//${game.appid}/${game.img_icon_url}.jpg`
    }
}

export {
    filterRecent
}