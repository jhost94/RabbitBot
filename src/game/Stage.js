var stageFunctionality = stageCommandModule();

var stageCommands = {
    add: stageFunctionality.addStage,
    change: stageFunctionality.change,
    show: stageFunctionality.show,
    hide: stageFunctionality.hide,
    finish: stageFunctionality.finish,
    rename: stageFunctionality.rename,
    delete: stageFunctionality.delete
}

function stageCommandModule() {
    function emptyStage(n) {
        return {
            name: n,
            deaths: 0,
            finished: false
        }
    }

    function changeStage(name) {
        if (typeof name == "object") {
            name = fixName(name);
        }

        if (stageExists(name)) {
            botStorage.currentGame.currentStage = botStorage.currentGame.stages[searchStageByName(name)];
            botStorage.currentGame.showStage = true;
            renderStage(name);
            return true
        } else {
            return false;
        }
    }

    function searchStageByName(name) {
        for (let i = 0; i <= botStorage.currentGame.stageID; i++) {
            if (botStorage.currentGame.stages[i] !== undefined &&
                botStorage.currentGame.stages[i].name.toLowerCase()
                === fixName(name).toLowerCase()) {
                return i;
            }
        }
        return -1;
    }

    function stageExists(name) {
        return searchStageByName(name) !== -1;
    }

    function checkCurrentGame() {
        return botStorage.currentGame !== undefined &&
            botStorage.currentGame !== null &&
            Object.keys(botStorage.currentGame).length !== 0;
    }

    function checkCurrentStage() {
        return botStorage.currentGame.currentStage !== undefined &&
            botStorage.currentGame.currentStage !== null &&
            Object.keys(botStorage.currentGame.currentStage).length > 0;
    }

    function fixName(name) {
        return typeof name === "string" ? name.trim() : name.join(" ").trim();
    }

    function hideStageLine() {
        hideStage();
    }

    function renderStage(name) {
        name = fixName(name);

        if (stageExists(name)) {
            refreshStageRender(botStorage.currentGame.currentStage.name, botStorage.currentGame.currentStage.deaths);
            botStorage.currentGame.showStage = true;
        } else {
            client.say(channel, "An error occured.");
        }
    }

    function isStageFinished() {
        return botStorage.currentGame.currentStage.finished;
    }

    return {
        addStage: function (channel, tags, name) {
            name = fixName(name);
            //Check if there is an active game
            if (!checkCurrentGame()) {
                client.say(channel, "There is no current game.");
                return false;
            }
            if (stageExists(name)) {
                client.say(channel, `A stage with the same name already exists, type !rb stage change ${name}, to change into it.`);
                return false;
            }
            if (name !== undefined && name !== null && name.length !== 0) {
                botStorage.currentGame.stages[botStorage.currentGame.stageID] = emptyStage(name);
                botStorage.currentGame.stageID++;
                changeStage(name);
            }
            return true;
        },
        change: function (channel, tags, name) {
            name = fixName(name);

            let isStageChanged = changeStage(name);
            client.say(channel, isStageChanged ? `Stage changed to ${name}` : `Stage ${name} not found or has been finished.`)

            return isStageChanged;
        },
        show: function (channel) {
            if (!checkCurrentGame() || !checkCurrentStage()) {
                client.say(channel, "An error occured.")
                return false;
            }
            renderStage(botStorage.currentGame.currentStage.name);
            return true;
        },
        hide: function () {
            if (!checkCurrentGame()) return false;

            hideStageLine();
            botStorage.currentGame.showStage = false;
            return true;
        },
        finish: function (channel) {
            if (checkCurrentGame() && !isStageFinished()) {
                botStorage.currentGame.currentStage.finished = true;
                client.say(channel, `Stage ${botStorage.currentGame.currentStage.name} finished with ${botStorage.currentGame.currentStage.deaths}.`);
                hideStageLine();
                botStorage.currentGame.currentStage = {};
                botStorage.currentGame.showStage = false;
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

            if (!checkCurrentGame() || !checkCurrentStage()) return false;
            let stageID = searchStageByName(names[0]);
            if (stageID === -1) return false;

            botStorage.currentGame.stages[stageID].name = names[1];
            changeStage(names[1]);
            return true;
        },
        delete: function (channel, tags, name) {
            name = fixName(name);
            if (!stageExists(name) || name.length === 0) return false;

            let stageID = searchStageByName(name);

            if (stageID === -1) return false;
            delete botStorage.currentGame.stages[stageID];

            if (checkCurrentStage() &&
                botStorage.currentGame.currentStage.name.toLowerCase() === name.toLowerCase().trim()) {
                hideStageLine();
                botStorage.currentGame.currentStage = {};
            }
            client.say(channel, `Stage ${name} was deleted from the stage list.`);

            return true;
        }
    }
}