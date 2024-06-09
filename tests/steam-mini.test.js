import "dotenv/config";
import { SteamMini } from "../dist/index.js";
import test from "ava";
import sinon from "sinon";

const steam = new SteamMini("XXX-XXX-XXX-XXX-XXX");

test("Constructor throws error if API key is not provided", (t) => {
  const error = t.throws(() => new SteamMini());
  t.is(error.message, "API key not provided. Please provide an API key.");
});

sinon.stub(steam, "getUserInfo").resolves({
  steamid: "fakeSteamId",
  avatar: "https://avatars.steamstatic.com/12",
  avatarmedium: "https://avatars.steamstatic.com/34",
  avatarfull: "https://avatars.steamstatic.com/56",
  personaname: "fakeSteamName",
  profileurl: "https://steamcommunity.com/id/fakeSteamId/",
  personastate: 0,
  lastlogoff: 12345,
});

test("get steam user info", async (t) => {
  const user = await steam.getUserInfo("fakeSteamId");
  t.not(user, null);

  t.is(user.steamid, "fakeSteamId");
  t.is(user.avatar, "https://avatars.steamstatic.com/12");
  t.is(user.avatarmedium, "https://avatars.steamstatic.com/34");
  t.is(user.avatarfull, "https://avatars.steamstatic.com/56");
  t.is(user.personaname, "fakeSteamName");
  t.is(user.profileurl, "https://steamcommunity.com/id/fakeSteamId/");
  t.is(user.personastate, 0);
  t.is(user.lastlogoff, 12345);
});

sinon.stub(steam, "getRecentlyPlayedGames").resolves([
  {
    appid: 12345,
    name: "fakeGameName",
    playtime_2weeks: 123,
    playtime_forever: 456,
    img_icon_url:
      "http://media.steampowered.com/steamcommunity/public/images/apps/12345/12.jpg",
  },
]);

test("get recently played games", async (t) => {
  const games = await steam.getRecentlyPlayedGames("fakeSteamId");
  t.not(games, null);

  t.is(games[0].appid, 12345);
  t.is(games[0].name, "fakeGameName");
  t.is(games[0].playtime_2weeks, 123);
  t.is(games[0].playtime_forever, 456);
  t.is(
    games[0].img_icon_url,
    "http://media.steampowered.com/steamcommunity/public/images/apps/12345/12.jpg"
  );
});

sinon.stub(steam, "getMostPlayed").callsFake(async (steamId, count) => {
  if (count < 1 || count > 10) {
    throw new Error("Count must be between 1 and 10");
  }

  return [
    {
      appid: 12345,
      name: "fakeGameName",
      playtime_2weeks: 123,
      playtime_forever: 456,
      img_icon_url:
        "http://media.steampowered.com/steamcommunity/public/images/apps/12345/12.jpg",
    },
  ];
});

test("get most played games", async (t) => {
  const games = await steam.getMostPlayed("fakeSteamId", 3);
  t.not(games, null);

  t.is(games[0].appid, 12345);
  t.is(games[0].name, "fakeGameName");
  t.is(games[0].playtime_2weeks, 123);
  t.is(games[0].playtime_forever, 456);
  t.is(
    games[0].img_icon_url,
    "http://media.steampowered.com/steamcommunity/public/images/apps/12345/12.jpg"
  );
});

test("getMostPlayed: count < 1 or count > 10 should throw error", async (t) => {
  const error = await t.throwsAsync(() =>
    steam.getMostPlayed("fakeSteamId", 11)
  );
  t.is(error.message, "Count must be between 1 and 10");
});
