import undici from 'undici'
import { GetRecentlyPlayedGames, ResponseSteamUser, GetTopGames } from './types/SteamMini'
import { filterRecent, filterTop } from "./utils";

const endpoints = {
    getUser: "/ISteamUser/GetPlayerSummaries/v0002/",
    recentlyPlayed: "/IPlayerService/GetRecentlyPlayedGames/v0001/",
    topGames: "/IPlayerService/GetOwnedGames/v0001/"
}

const status = {
    403: "Invalid API Key",
    500: "Internal Server Error",
    404: "Invalid Steam ID"
}

const reID = /^\d{17}$/;

class SteamMini {
    readonly apiKey: string
    private baseUrl: string

    constructor(apiKey) {
        this.apiKey = apiKey
        this.baseUrl = "https://api.steampowered.com"
        if (!apiKey) throw new Error('API Key not provided')
    }

    private async _request(endpoint: string, params: string) {
        try {
            const response = await undici.request(`${this.baseUrl}${endpoint}?${params}`)

            let responseBody;
            if (response.headers["content-type"].includes("application/json")) {
                responseBody = await response.body.json()
            } else {
                responseBody = await response.body.text()
            }

            if (status[response.statusCode]) {
                throw new Error(status[response.statusCode])
            }

            return responseBody
        } catch(err: any) {
            throw new Error(err)
        }
    }

    public async getUser(steamid: string) {
        try {
            if (!steamid || !reID.test(steamid)) throw new Error('No/Invalid Steam User ID provided')
            const response  = await this._request(endpoints.getUser, `key=${this.apiKey}&steamids=${steamid}`)
            const data = response as ResponseSteamUser
            return data.response.players[0]
        } catch(err: any) {
            throw new Error(err)
        }
    }

    public async getRecentlyPlayed(steamid: string, limit: number = 1) {
        try {
            if (!steamid || !reID.test(steamid)) throw new Error('No/Invalid Steam User ID provided')
            if (limit < 1 || limit > 5) throw new Error('Limit should be between 1 to 5')
            const response = await this._request(endpoints.recentlyPlayed, `key=${this.apiKey}&steamid=${steamid}&limit=${limit}`)
            const data = response as GetRecentlyPlayedGames
            if (!data.response?.total_count) return []
            const recentGames = data.response.games.map(game => {
                return filterRecent(game)
            })
            return recentGames
        } catch(err: any) {
            throw new Error(err)
        }
    }

    public async getTopGames(steamid: string) {
        try {
            if (!steamid || !reID.test(steamid)) throw new Error('No/Invalid Steam User ID provided')
            const response = await this._request(endpoints.topGames, `key=${this.apiKey}&steamid=${steamid}`)
            const data = response as GetTopGames
            if (!data.response?.game_count) return []
            const topGames = data.response.games.map(game => {
                return filterTop(game)
            }).sort((a, b) => b.playtime - a.playtime).slice(0, 5)
            return topGames
        } catch(err: any) {
            throw new Error(err)
        }
    }
}

export {
    SteamMini
}