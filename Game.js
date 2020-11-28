let gameList = [];

function addGame(game){
    if (gameInList(game)) {
        gameList.push(game);
    }
}

function gameInList(game){
    return gameList.filter(game);
}