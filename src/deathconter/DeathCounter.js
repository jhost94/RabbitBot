//const { client } = require("tmi.js");

let deathCommandFunctionality = deathCounterCommandModule();

let deathCounterCommands = {
    add: deathCommandFunctionality.add,
    set: deathCommandFunctionality.set
}

//DeathCounter commands
function deathCounterCommandModule() {

    function checkDeathCounter() {
        return botStorage.currentGame !== undefined &&
            botStorage.currentGame !== null &&
            Object.keys(botStorage.currentGame).length > 0;
    }

    function saveCurrentGame() {
        botStorage.games[botStorage.currentGame.name] = botStorage.currentGame;
    }

    return {
        add: function add(channel) {
            if (!checkDeathCounter()) {
                client.say(channel, "There is no current game active.");
                return false;
            }

            botStorage.currentGame.deathCounter++;
            
            if (botStorage.currentGame.currentBoss !== undefined && !botStorage.currentGame.currentBoss.defeated) {
                botStorage.currentGame.currentBoss.deaths++;
            }
            return true;
        },
        set: function set(channel, tags, n) {
            if(!checkDeathCounter()){
                client.say(channel, "There is no current game active.");
                return false;
            }
            n = parseInt(n[0], 10);
            if (!isNaN(n)) {
                botStorage.currentGame.deathCounter = n;
            }
            return true;
        }
    }
}



