let gameCommandFunctionality = gameCommandModule();

let gameCommands = {
    add: gameCommandFunctionality.addGame,
    change: gameCommandFunctionality.changeGame,
    delete: gameCommandFunctionality.deleteGame,
    list: gameCommandFunctionality.listGames
}

function gameCommandModule() {
    function emptyGame(n) {
        return {
            name: n,
            deathCounter: 0
        };
    }
    function changeGame(channel, tags, game) {
        if (typeof game == "object"){
            game = game.join(" ");
        }
        if (gameExists(game)) {
            botStorage.currentGame = botStorage.games[searchGameByName(game)];
            //Temp
            renderTitleName(botStorage.currentGame.name);
            renderTitleValue(botStorage.currentGame.deathCounter);
        }
    }
    function searchGameByName(game){
        for(let i = 0; i < botStorage.gameID; i++){
            if(botStorage.games[i] !== undefined && botStorage.games[i].name === game){
                return i;
            }
        }
        return -1;
    }
    function gameExists(game){
        return searchGameByName(game) !== -1 ? true : false;
    }
    function listGames(){
        return(Object.getOwnPropertyNames(botStorage.games));
    }
    return {
        addGame: function (channel, tags, game) {
            game = game.join(" ");
            if (gameExists(game)) {
                client.say(channel, `That game is already in the list, type !rb changegame ${game}, to change to it`);
                return;
            }
            if (game !== null || game !== undefined) {
                botStorage.games[botStorage.gameID] = emptyGame(game);
                botStorage.gameID++;
                changeGame(channel, tags, game);
            }
        },
        changeGame: changeGame,
        deleteGame: function(channel, tags, game){
            game = game.join(" ");
            if(gameExists(game)){
                delete botStorage.games[searchGameByName(game)];
                client.say(channel, `Game ${game} was deleted from the game list.`);
                var lastGameIndex = listGames()[listGames().length - 1];
                console.log(lastGameIndex);
                if(lastGameIndex !== undefined){
                    changeGame(channel, tags, botStorage.games[lastGameIndex].name);
                } else {
                    renderTitleName("Game");
                    renderTitleValue(0);
                }
            } else {
                client.say(channel, `No games were found with that name, please type !rb game list to get the list of all the games.`)
            }
        },
        listGames: function (channel, tags, game){
            var gameList = listGames().map(ele => botStorage.games[ele].name);
            client.say(channel, `Games currently in the game list: ${gameList}`);
        }
    }
}