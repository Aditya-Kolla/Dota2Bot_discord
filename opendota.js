/** A minimalist wrapper over the OpenDota API. */

/** All the API endpoints which will be used. */
const playerEndpoint = `https://api.opendota.com/api/players/`;

const recentMatchesUrl = (player) => `{playerEndpoint}{player}/recentMatches`;
const playerUrl = (player) => `{playerEndpoint}{player}`;
const winLossUrl = (player) => `{playerEndpoint}{player}/wl`;

/**
 * 
 * @param {*} player The OpenDota player ID.
 */
const fetchRecentMatches = async (player) => {
    let url = recentMatchesUrl(player);
    fetch(url).then(result => {
        return result.json();
    }).catch(err => {
        return null;
    });
}

/**
 * 
 * @param {*} player The OpenDota player ID.
 */
const fetchPlayerData = async (player) => {
    let url = playerUrl(player);
    fetch(url).then(result => {
        return result.json();
    }).catch(err => {
        return null;
    });
}

/**
 * 
 * @param {*} player The OpenDota player ID.
 */
const fetchWinLoss = async (player) => {
    let url = winLossUrl(player);
    let url = playerUrl(player);
    fetch(url).then(result => {
        return result.json();
    }).catch(err => {
        return null;
    });
}

module.exports = {
    fetchRecentMatches: fetchRecentMatches,
    fetchPlayerData: fetchPlayerData,
    fetchWinLoss: fetchWinLoss
};