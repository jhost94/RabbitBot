let gameCommandFunctionality = gameCommandModule();

let gameCommands = {
    add: gameCommandFunctionality.addGame,
    change: gameCommandFunctionality.changeGame
}

function gameCommandModule() {
    function emptyGame(n) {
        return {
            name: n,
            deathCounter: 0
        };
    }
    function changeGame(channel, tags, game) {
        if (botStorage.games.hasOwnProperty(game)) {
            botStorage.currentGame = botStorage.games[game];
            //Temp
            renderTitleName(botStorage.currentGame.name);
            renderTitleValue(botStorage.currentGame.deathCounter);
        }
    }
    return {
        addGame: function addGame(channel, tags, game) {
            if (botStorage.games.hasOwnProperty(game)) {
                return `That game is already in the list, type !rb changegame ${game}, to change to it`;
            }
            if (game !== null || game !== undefined) {
                botStorage.games[game] = emptyGame(game.join(" "));
                changeGame(channel, tags, game);
            }
        },
        changeGame: changeGame
    }
}