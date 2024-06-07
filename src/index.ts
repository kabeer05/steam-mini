import undici, { Headers } from "undici";

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

  /**
   * Constructor to initialize the SteamMini class with an API key.
   * @param apiKey - The API key for authenticating with the Steam API.
   * @throws Will throw an error if the API key is not provided.
   */
  constructor(apiKey: string) {
    if (!apiKey)
      throw new Error("API key not provided. Please provide an API key.");
    this.apiKey = apiKey;
  }

  /**
   * Private method to make HTTP requests to the Steam API.
   * @param endpoint - The specific API endpoint to call.
   * @param params - The query parameters to include in the API call.
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
}
