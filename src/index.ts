import undici from "undici";
import type { SteamGame, SteamUser } from "./types";

// Define useful endpoints for Steam API calls
const endpoints: {
  [key: string]: string;
} = {
  getUser: "/ISteamUser/GetPlayerSummaries/v0002/",
  recentlyPlayed: "/IPlayerService/GetRecentlyPlayedGames/v0001/",
  topGames: "/IPlayerService/GetOwnedGames/v0001/",
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
    const url = `${base}${endpoint}?key=${this.apiKey}&${params.toString()}`;
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
      return data.response.games; // Return the games array from the response data
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default SteamMini;
