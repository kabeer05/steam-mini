import undici from "undici";
import type { SteamGame, SteamUser } from "./types";

// Define useful endpoints for Steam API calls
const endpoints: {
  [key: string]: string;
} = {
  getUser: "/ISteamUser/GetPlayerSummaries/v0002/",
  recentlyPlayed: "/IPlayerService/GetRecentlyPlayedGames/v0001/",
  mostPlayed: "/IPlayerService/GetOwnedGames/v0001",
};

// Define HTTP status codes and their corresponding error messages
const statusCodes: {
  [key: number]: string;
} = {
  403: "Invalid API Key",
  500: "Internal Server Error",
  404: "Invalid Steam ID",
};

class SteamMini {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.steampowered.com/";

  static steamUserID = RegExp(/^\d{17}$/, "i"); // Regex to validate 64 bit Steam IDs

  /**
   * Constructor to initialize the SteamMini class with an API key.
   * @param {string} apiKey - The API key for authenticating with the Steam API.
   * @example
   * ```js
   * const steam = new SteamMini("YOUR_API_KEY");
   * ```
   * @throws Will throw an error if the API key is not provided.
   */
  constructor(apiKey: string) {
    if (!apiKey)
      throw new Error("API key not provided. Please provide an API key.");
    this.apiKey = apiKey;
  }

  /**
   * Private method to make HTTP requests to the Steam API.
   * @param {string} endpoint - The specific API endpoint to call.
   * @param {URLSearchParams} params - The query parameters to include in the API call.
   * @param {string} base - The base URL to make the request to.
   * @returns A promise that resolves to the response data.
   * @throws Will throw an error if the response status code is not 200 or if there's another error.
   */
  private async _request(
    endpoint: string,
    params: URLSearchParams,
    base: string = this.baseUrl
  ): Promise<any> {
    const url = `${base}${endpoint}?key=${
      this.apiKey
    }&${params.toString()}&format=json`;
    try {
      const response = await undici.request(url);

      // Check if the response status code is not 200 or if there is a predefined error message
      if (statusCodes[response.statusCode] || response.statusCode !== 200) {
        throw new Error(
          statusCodes[response.statusCode] ||
            "An error occurred while making the request"
        );
      }

      // Check if the response's content-type is JSON and parse accordingly
      if (response.headers["content-type"]?.includes("application/json")) {
        return response.body.json();
      } else {
        return response.body.text();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  /**
   * Method to retrieve a single user's information from the Steam API using a 64 bit Steam ID.
   * @param {string} steamId - The 64 bit Steam ID of the user to retrieve information for.
   * @example
   * ```js
   * const userInfo = await steam.getUserInfo("76561198916391289");
   * console.log(userInfo);
   * ```
   * @returns A promise that resolves to the Steam user information.
   * @throws Will throw an error if the Steam ID is invalid or if the request fails.
   */
  public async getUserInfo(steamId: string): Promise<SteamUser> {
    // Check if the steamId is valid or not empty and matches the 64 Bit Steam ID format
    if (!steamId || !SteamMini.steamUserID.test(steamId))
      throw new Error("Invalid Steam ID was provided.");

    const params = new URLSearchParams({ steamids: steamId });
    try {
      const data = await this._request(endpoints.getUser, params);
      return data.response.players[0]; // Return the first user object from the response data
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Method to retrieve a user's recently played games from the Steam API using a 64 bit Steam ID.
   * @param {string} steamId - The 64 bit Steam ID of the user to retrieve recently played games for.
   * @param {number} count - The number of recently played games to retrieve (default is 3).
   * @example
   * ```js
   * const recentlyPlayedGames = await steam.getRecentlyPlayedGames("76561198916391289", 5);
   * console.log(recentlyPlayedGames);
   * ```
   * @returns A promise that resolves to an array of recently played games.
   * @throws Will throw an error if the Steam ID is invalid or if the request fails.
   */
  public async getRecentlyPlayedGames(
    steamId: string,
    count: number = 3
  ): Promise<SteamGame[]> {
    // Check if the steamId is valid or not empty and matches the 64 Bit Steam ID format
    if (!steamId || !SteamMini.steamUserID.test(steamId))
      throw new Error("Invalid Steam ID was provided.");

    const params = new URLSearchParams({
      steamid: steamId,
      count: count.toString(),
    });
    try {
      const data = await this._request(endpoints.recentlyPlayed, params);
      return data.response.games.map((game: any) => {
        return {
          appid: game.appid,
          name: game.name,
          playtime_2weeks: game.playtime_2weeks || 0,
          playtime_forever: game.playtime_forever,
          img_icon_url: game.img_icon_url,
          playtime_windows_forever: game.playtime_windows_forever,
          playtime_mac_forever: game.playtime_mac_forever,
          playtime_linux_forever: game.playtime_linux_forever,
        };
      }); // Return the mapped games array from the response data
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Method to retrieve a user's most played games from the Steam API using a 64 bit Steam ID.
   * @param {string} steamId - The 64 bit Steam ID of the user to retrieve most played games for.
   * @param {number} count - The number of most played games to retrieve (default is 3).
   * @param {object} options - Additional options for the request (default is { includePlayedFreeGames: false, includeAppInfo: true }).
   * @example
   * ```js
   * const mostPlayedGames = await steam.getMostPlayed("76561198916391289", 5);
   * console.log(mostPlayedGames);
   * ```
   * @returns A promise that resolves to an array of most played games.
   * @throws Will throw an error if the Steam ID is invalid or if the request fails.
   */
  public async getMostPlayed(
    steamId: string,
    count: number = 3,
    options: { includePlayedFreeGames: boolean; includeAppInfo: boolean } = {
      includePlayedFreeGames: false,
      includeAppInfo: true,
    }
  ): Promise<SteamGame[]> {
    // Check if the steamId is valid or not empty and matches the 64 Bit Steam ID format
    if (!steamId || !SteamMini.steamUserID.test(steamId))
      throw new Error("Invalid Steam ID was provided.");

    if (count < 1 || count > 10)
      throw new Error("Count must be between 1 and 10.");

    const params = new URLSearchParams({
      steamid: steamId,
      count: count.toString(),
      include_played_free_games: options.includePlayedFreeGames ? "1" : "0",
      include_appinfo: options.includeAppInfo ? "1" : "0",
    });
    try {
      const data = await this._request(endpoints.mostPlayed, params);
      return data.response.games
        .map((game: any) => {
          return {
            appid: game.appid,
            name: game.name,
            playtime_2weeks: game.playtime_2weeks || 0,
            playtime_forever: game.playtime_forever,
            img_icon_url: game.img_icon_url,
            playtime_windows_forever: game.playtime_windows_forever,
            playtime_mac_forever: game.playtime_mac_forever,
            playtime_linux_forever: game.playtime_linux_forever,
          };
        })
        .sort(
          (a: SteamGame, b: SteamGame) =>
            b.playtime_forever -
            a.playtime_forever /* Sort the games array by playtime_forever in descending order */
        )
        .slice(0, count); // Return the most played games array from the response data
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default SteamMini;
