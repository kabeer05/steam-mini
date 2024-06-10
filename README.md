<img src="./assets/images/project_banner.png" style="border-radius:20px" />

<div align="center"><h3>
Simple Steam API wrapper exposing some useful methods
</h3></div>

## Requirements

> Get a <a href="https://steamcommunity.com/dev/apikey">Steam API Key</a> for the package.

## Installation

```sh
# Install with npm
npm install steam-mini-api
```

## Usage

```js
import { SteamMini } from "steam-mini-api";

const steam = new SteamMini("<YOUR-STEAM-API-KEY>");

// Get info about a single steam user by their 64 bit steam id
const user = await steam.getUserInfo("<STEAM-USER-ID>");

// Get the user's most recently played games (default return limit is 1)
const recentlyPlayed = await steam.getRecentlyPlayedGames("<STEAM-USER-ID>", 4);

// Get topmost played games, sorted by playtime
const topGames = await steam.getMostPlayed("<STEAM-USER-ID>", 4, {
  includePlayedFreeGames: false,
  includeAppInfo: true,
});
```

## Methods

### **getUserInfo()**&nbsp;&nbsp;&nbsp;`Promise<Object>`

<table>
    <tr>
        <th>Options</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>steamid</th>
        <th>string</th>
        <th>The 64 bit steam id of the player to get the info of.</th>
    </tr>
</table>

<br/>

### **getRecentlyPlayedGames()**&nbsp;&nbsp;&nbsp;`Promise<Array>`

<table>
    <tr>
        <th>Options</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>steamid</th>
        <th>string</th>
        <th>The 64 bit steam id of the player to get the info of.</th>
    </tr>
    <tr>
        <th>count</th>
        <th>number</th>
        <th>Count of recently played games to return. (Default: 3)</th>
    </tr>
</table>

<br/>

### **getMostPlayed()**&nbsp;&nbsp;&nbsp;`Promise<Array>`

<table>
    <tr>
        <th>Options</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <th>steamid</th>
        <th>string</th>
        <th>The Steam User ID of the player to get the info of.</th>
    </tr>
    <tr>
        <th>count</th>
        <th>number (1 <= n <= 10)</th>
        <th>Count of recently played games to return. (Default: 3)</th>
    </tr>
    <tr>
        <th>options.includePlayedFreeGames</th>
        <th>boolean</th>
        <th>Include free games if the player has played them. (Default: false)</th>
    </tr>
    <tr>
        <th>options.includeAppInfo</th>
        <th>boolean</th>
        <th>Include game name and logo information in the output. (Default: true)</th>
    </tr>
</table>

## License

Steam Mini is packaged and distributed using the [MIT License](/LICENSE.md) which allows for commercial use, distribution, modification and private use provided that all copies of the software contain the same license and copyright.
