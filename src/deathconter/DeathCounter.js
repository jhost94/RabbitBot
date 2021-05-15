//const { client } = require("tmi.js");

let deathCommandFunctionality = deathCounterCommandModule();

let deathCounterCommands = {
    add: deathCommandFunctionality.add,
    set: deathCommandFunctionality.set
}

//DeathCounter commands
function deathCounterCommandModule() {

    function checkExtraCounters(c) {
        let currentC = "current" + c;
        let visibleC = "show" + c;
        if (botStorage.currentGame[visibleC] && botStorage.currentGame.hasOwnProperty(currentC)) {
            if (typeof botStorage.currentGame[currentC].deaths === "number" &&
                !botStorage.currentGame[currentC].finished) {

                botStorage.currentGame[currentC].deaths++;
            }
        }
    }

    function checkDeathCounter() {
        return botStorage.currentGame !== undefined &&
            botStorage.currentGame !== null &&
            Object.keys(botStorage.currentGame).length > 0;
    }

    return {
        add: function add(channel) {
            if (!checkDeathCounter()) {
                client.say(channel, "There is no current game active.");
                return false;
            }

            checkExtraCounters("Stage");
            checkExtraCounters("Boss");
            botStorage.currentGame.deathCounter++;

            return true;
        },
        set: function set(channel, tags, n) {
            if (!checkDeathCounter()) {
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