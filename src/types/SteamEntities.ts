export interface SteamGame {
    name: string;
    appid: string;
    playtime_forever: number;
    playtime_2weeks: number;
    img_icon_url: string;
    img_logo_url: string;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
}

export interface SteamUser {
    steamid: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personaname: string;
    profileurl: string;
    personastate: number;
    communityvisibilitystate: number;
    profilestate: number;
    lastlogoff: number;
    commentpermission: string;
    realname?: string;
    primaryclanid?: string;
    timecreated?: number;
    gameid?: string;
    gameserverip?: string;
    gameextrainfo?: string;
    loccountycode?: string;
    locstatecode?: string;
    loccityid?: string;
}