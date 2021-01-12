let gameCommandFunctionality = gameCommandModule();

let gameCommands = {
    add: gameCommandFunctionality.addGame,
    change: gameCommandFunctionality.changeGame,
    delete: gameCommandFunctionality.deleteGame,
    list: gameCommandFunctionality.listGames,
    rename: gameCommandFunctionality.changeGameName
}

function gameCommandModule() {
    function emptyGame(n) {
        return {
            name: n,
            deathCounter: 0
        };
    }
    function changeGame(game) {
        if (typeof game == "object"){
            game = game.join(" ");
        }
        console.log(game);
        if (gameExists(game)) {
            botStorage.currentGame = botStorage.games[searchGameByName(game)];
            //Temp
            renderTitleName(botStorage.currentGame.name);
            renderTitleValue(botStorage.currentGame.deathCounter);
            return true;
        }
        return false;
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
                changeGame(game);
            }
        },
        changeGame: function (channel, tags, game){
            game = game.join(" ").trim();
            if(changeGame(game)){
                client.say(channel, `Game changed to ${game}`)
            } else {
                client.say(channel, `Game not found, please type !rb game list to get get the list of all games.`)
            }
        },
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
        },
        changeGameName: function (channel, tags, name){
            var oldGameName = botStorage.currentGame.name;
            name = name.join(" ").split(",");
            name[0] = name[0].trim();
            name[1] = name[1].trim();
            if(gameExists(name[0])){
                botStorage.games[searchGameByName(name[0])].name = name[1];
                console.log(`<${name[0]}:${oldGameName}>${name[1]}`);
                if(oldGameName === name[0]){
                    changeGame(channel, tags, name[1]);
                }
                client.say(channel, `${name[0]} changed to ${name[1]}`);
            } else {
                client.say(channel, `Game not found.`);
            }
        }
    }
}