import { SteamGame, SteamUser } from './SteamEntities'

export interface GetRecentlyPlayedGames {
    response: {
        total_count: number;
        games: SteamGame[];
    }
};

export interface GetTopGames {
    response: {
        game_count: number;
        games: SteamGame[];
    }
};

export interface ResponseRecentlyPlayed {
    appid: string;
    name: string;
    image: string;
}

export interface ResponseSteamUser {
    response: {
        players: SteamUser[];
    }
}

export interface ResponseTopGames {
    appid: string
    name: string
    image: string
    playtime: number
};