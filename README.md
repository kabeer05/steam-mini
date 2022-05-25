# steam-mini
#### Simple Steam wrapper exposing some useful methods

<br/>

# Requirements
#### Get a <a href="https://steamcommunity.com/dev/apikey">Steam API Key</a> for the package.

<br/>

# Installation
```js
yarn add steam-mini
```

<br/>

# Usage
```js
const { SteamMini } = require('steam-mini')

const steam = new SteamMini("<YOUR-STEAM-API-KEY>")

// Get info about a steam user by their id
const user = await steam.getUser("<STEAM-USER-ID>")

// Get the most recently played games in 2 weeks playtime, default return limit is 1 and maximum is 5
//If no games are played an empty array [] is returned
const recentlyPlayed = await steam.getRecentlyPlayed("<STEAM-USER-ID>", 4)
```

<br/>

# Methods

### <u>**getUser()**</u>

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
</table>

<br/>

### <u>**getRecentlyPlayed()**</u>

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
        <th>limit</th>
        <th>number (1 <= n <= 5)</th>
        <th>Limit the number of recently played games to return. (default: 1)</th>
    </tr>
</table>

<br/>

> **Note**: A JSON Error **might** come up if API Key or Steam ID is invalid.