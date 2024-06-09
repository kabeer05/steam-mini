type SteamUser = {
  steamid: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personaname: string;
  profileurl: string;
  personastate: number;
  lastlogoff: number;
};

type SteamGame = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
};

export { SteamUser, SteamGame };
