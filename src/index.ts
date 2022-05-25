import fetch from "node-fetch";
import { GetRecentlyPlayedGames, ResponseSteamUser } from './types/SteamMini'
import { filterRecent } from "./utils";

const endpoints = {
    getUser: "/ISteamUser/GetPlayerSummaries/v0002/",
    recentlyPlayed: "/IPlayerService/GetRecentlyPlayedGames/v0001/",
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

    public async getUser(steamid: string) {
        try {
            if (!steamid || !reID.test(steamid)) throw new Error('No/Invalid Steam User ID provided')
            const response = await fetch(`${this.baseUrl}${endpoints.getUser}?key=${this.apiKey}&steamids=${steamid}`)
            const data = (await response.json()) as ResponseSteamUser
            if (!data) return {}
            return data.response.players[0]
        } catch(err: any) {
            throw new Error(err)
        }
    }

    public async getRecentlyPlayed(steamid: string, limit: number = 1) {
        try {
            if (!steamid || !reID.test(steamid)) throw new Error('No/Invalid Steam User ID provided')
            if (limit < 1 || limit > 5) throw new Error('Limit should be between 1 to 5')
            const response = await fetch(`${this.baseUrl}${endpoints.recentlyPlayed}?key=${this.apiKey}&steamid=${steamid}&limit=${limit}`)
            const data = (await response.json()) as GetRecentlyPlayedGames
            if (!data.response?.games) return []
            const recentGames = data.response.games.map(game => {
                return filterRecent(game)
            })
            return recentGames
        } catch(err: any) {
            throw new Error(err)
        }
    }
}

export {
    SteamMini
}