//const { client } = require("tmi.js");

var bossFunctionality = bossCommandModule();

var bossCommands = {
    add: bossFunctionality.addBoss,
    change: bossFunctionality.change,
    show: bossFunctionality.show,
    hide: bossFunctionality.hide,
    finish: bossFunctionality.finish
}

function bossCommandModule() {
    function emptyBoss(n) {
        return {
            name: n,
            deaths: 0,
            defeated: false
        }
    }

    function changeBoss(name) {
        if (typeof name == "object") {
            name = fixName(name);
        }
        //NEED FIXING
        if (bossExists(name)) {
            botStorage.currentGame.currentBoss = botStorage.currentGame.bosses[searchBossByName(name)];
            renderBoss(name)
            return true
        } else {
            return false;
        }
    }

    function searchBossByName(name) {
        for (let i = 0; i <= botStorage.currentGame.bossID; i++) {
            if (botStorage.currentGame.bosses[i] !== undefined &&
                botStorage.currentGame.bosses[i].name.toLowerCase()
                === name.toLowerCase().trim()) {
                return i;
            }
        }
        return -1;
    }

    function bossExists(name) {
        return searchBossByName(name) !== -1;
    }

    function checkCurrentGame() {
        console.log(botStorage.currentGame)
        return botStorage.currentGame !== undefined &&
            botStorage.currentGame !== null &&
            Object.keys(botStorage.currentGame).length !== 0;
    }

    function fixName(name) {
        console.log(name)
        return typeof name === "string" ? name.trim() : name.join(" ").trim();
    }

    function hideBoss() {

    }

    function renderBoss(name) {
        if (typeof name !== "string") {
            name = fixName(name);
        }

        if (bossExists(name)) {
            refreshBossRender(botStorage.currentGame.currentBoss.name, botStorage.currentGame.currentBoss.deaths);
            botStorage.currentGame.showBoss = true;
        } else {
            client.say(channel, "An error occured.");
        }
    }

    function isBossFinished() {
        return botStorage.currentGame.currentBoss.defeated;
    }

    return {
        addBoss: function (channel, tags, name) {
            name = fixName(name);
            //Check if there is an active game
            if (!checkCurrentGame()) {
                client.say(channel, "There is no current game.");
                return false;
            }
            if (bossExists(name)) {
                client.say(channel, `That boss is already in the list, type !rb boss change ${name}, to change into it.`);
                return false;
            }
            console.log(name)
            if (name !== undefined && name !== null && name.length !== 0) {
                botStorage.currentGame.bosses[botStorage.currentGame.bossID] = emptyBoss(name);
                botStorage.currentGame.bossID++;
                changeBoss(name);
            }
            return true;
        },
        change: function (channel, tags, name) {
            name = fixName(name);

            let isBossChanged = changeBoss(name);
            client.say(channel, isBossChanged ? `Boss changed to ${name}` : `Boss ${name} not found.`)

            return isBossChanged;
        },
        show: function (channel) {
            if (!checkCurrentGame()) {
                client.say(channel, "No current game found.")
                return false;
            }
            renderBoss(botStorage.currentGame.currentBoss.name);
            return true;
        },
        hide: function () {
            hideBoss();
            if (!checkCurrentGame()) {
                return false;
            }
            botStorage.currentGame.showBoss = false;
            return true;
        },
        finish: function (channel) {
            if (checkCurrentGame() && !isBossFinished()) {
                botStorage.currentGame.currentBoss.defeated = true;
                client.say(channel, `Boss ${botStorage.currentGame.currentBoss.name} finished with ${botStorage, currentGame, currentBoss, deaths}.`);
                hideBoss();
                botStorage.currentGame.currentBoss = {};
            } else {
                client.say(channel, "There was an error");
                return false;
            }
            return true;
        },
        rename: function () {
            return true;
        },
        delete: function () {
            return true;
        }
    }
}