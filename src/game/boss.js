var stageFunctionality = stageCommandModule();

var bossCommands = {
    add: stageFunctionality.addBoss,
    change: stageFunctionality.change,
    show: stageFunctionality.show,
    hide: stageFunctionality.hide,
    finish: stageFunctionality.finish,
    rename: stageFunctionality.rename,
    delete: stageFunctionality.delete
}

function stageCommandModule() {
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
                === fixName(name).toLowerCase()) {
                return i;
            }
        }
        return -1;
    }

    function bossExists(name) {
        return searchBossByName(name) !== -1;
    }

    function checkCurrentGame() {
        return botStorage.currentGame !== undefined &&
            botStorage.currentGame !== null &&
            Object.keys(botStorage.currentGame).length !== 0;
    }

    function checkCurrentBoss() {
        return botStorage.currentGame.currentBoss !== undefined &&
            botStorage.currentGame.currentBoss !== null &&
            Object.keys(botStorage.currentGame.currentBoss).length > 0;
    }

    function fixName(name) {
        return typeof name === "string" ? name.trim() : name.join(" ").trim();
    }

    function hideBossLine() {
        hideBoss();
    }

    function renderBoss(name) {
        name = fixName(name);

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
            client.say(channel, isBossChanged ? `Boss changed to ${name}` : `Boss ${name} not found or has been finished.`)

            return isBossChanged;
        },
        show: function (channel) {
            if (!checkCurrentGame() || !checkCurrentBoss()) {
                client.say(channel, "An error occured.")
                return false;
            }
            renderBoss(botStorage.currentGame.currentBoss.name);
            return true;
        },
        hide: function () {
            if (!checkCurrentGame()) return false;

            hideBossLine();
            botStorage.currentGame.showBoss = false;
            return true;
        },
        finish: function (channel) {
            if (checkCurrentGame() && !isBossFinished()) {
                botStorage.currentGame.currentBoss.defeated = true;
                client.say(channel, `Boss ${botStorage.currentGame.currentBoss.name} finished with ${botStorage.currentGame.currentBoss.deaths}.`);
                hideBossLine();
                botStorage.currentGame.currentBoss = {};
                botStorage.currentGame.showBoss = false;
            } else {
                client.say(channel, "There was an error");
                return false;
            }
            return true;
        },
        rename: function (channel, tags, names) {
            names = fixName(names);
            if (names.length === 0) return false;
            names = names.split(",");
            if (names.length < 2) return false;

            names[0] = fixName(names[0]);
            names[1] = fixName(names[1]);

            if (!checkCurrentGame() || !checkCurrentBoss()) return false;
            let bossID = searchBossByName(names[0]);
            if (bossID === -1) return false;

            console.log(botStorage.currentGame.bosses[bossID].name)
            botStorage.currentGame.bosses[bossID].name = names[1];
            changeBoss(names[1]);
            console.log(botStorage.currentGame.bosses[bossID].name)
            return true;
        },
        delete: function (channel, tags, name) {
            name = fixName(name);
            if (!bossExists(name) || name.length === 0) return false;


            let bossID = searchBossByName(name);

            if (bossID === -1) return false;
            delete botStorage.currentGame.bosses[bossID];

            if (checkCurrentBoss() &&
                botStorage.currentGame.currentBoss.name.toLowerCase() === name.toLowerCase().trim()) {
                hideBossLine();
                botStorage.currentGame.currentBoss = {};
            }
            client.say(channel, `Boss ${name} was deleted from the boss list.`);

            return true;
        }
    }
}