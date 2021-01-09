let deathCommandFunctionality = deathCounterCommandModule();

let deathCounterCommands = {
    add: deathCommandFunctionality.add,
    set: deathCommandFunctionality.set
}

//DeathCounter commands
function deathCounterCommandModule() {
    function showDeathCounter() {
        renderTitleValue(botStorage.currentGame.deathCounter);
        renderTitleName(botStorage.currentGame.name);
        //saveCurrentGame();
    }

    function checkDeathCounter() {
        showDeathCounter();
        if (botStorage.currentGame.deathCounter === undefined || botStorage.currentGame.deathCounter === null) {
            return "No current game active";
        }
    }

    function saveCurrentGame (){
        botStorage.games[botStorage.currentGame.name] = botStorage.currentGame;
    }

    return {
        add: function add() {
            checkDeathCounter();
            botStorage.currentGame.deathCounter++;
            showDeathCounter();
        },
        set: function set(channel, tags, n) {
            checkDeathCounter();
            n = parseInt(n[0], 10);
            if (!isNaN(n)) {
                botStorage.currentGame.deathCounter = n;
            }
            showDeathCounter();
        } 
    }
}



