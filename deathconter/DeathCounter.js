let localDeathCounterStorage = "Path";
let game = new Gamepad(gameList);

function incrementDeathCounter(currentGame){
    if (game.gameInList(currentGame)){
        gameList[currentGame].deathCounter = {}
    }
}