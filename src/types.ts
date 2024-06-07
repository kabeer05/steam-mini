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

export { SteamUser };
