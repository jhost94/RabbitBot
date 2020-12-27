let deathCommandFunctionality = deathCounterCommandModule();

    let deathCounterCommands = {
        add: deathCommandFunctionality.add,
        set: deathCommandFunctionality.set
    }


//DeathCounter commands
function deathCounterCommandModule() {
    return {
        add: function add() {
            checkDeathCounter();
            botStorage.deathCounter++;
            showDeathCounter();
        },
        set: function set(channel, tags, n) {
            checkDeathCounter();
            n = parseInt(n[0], 10);
            if (typeof n === "number") {
                botStorage.deathCounter = n;
            } else {
                console.log("n is not a number, n is " + typeof n);
            }
            showDeathCounter();
        },

        //DeathCounter storage management
        checkDeathCounter: function checkDeathCounter() {
            showDeathCounter();
            if (botStorage.deathCounter === undefined || botStorage.deathCounter === null) {
                botStorage.deathCounter = 0;
            }
        },

        //Show the game and deaths on screen
        showGameName: function showGameName(channel, tags, name) {
            name = name[0];
            renderTitleName(name);
        },
        showDeathCounter: function showDeathCounter() {
            renderTitleValue(botStorage.deathCounter);
        }
    }
}



