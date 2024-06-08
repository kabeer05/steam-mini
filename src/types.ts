type SteamUser = {
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
};

type SteamGame = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
};

export { SteamUser, SteamGame };
