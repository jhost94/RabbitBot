var bossFunctionality = bossCommandModule();

var bossCommands = {
    add: bossFunctionality.addBoss,
    change: bossFunctionality.change
}

function bossCommandModule() {
    function emptyBoss(n) {
        return {
            name: n,
            deaths: 0,
            defeated: false
        }
    }

    function changeBoss(name){
        if (typeof name == "object"){
            name = name.join(" ");
        }
        //NEED FIXING
        if(botStorage.currentGame.bosses.contains(name)){
            botStorage.currentGame.currentBoss = botStorage.currentGame.bosses[botStorage.currentGame.bosses.indexOf(name)];
            // render boss on screen
            return true
        } else {
            return false;
        }
    }

    return {
        addBoss: function(channel, tags, name){
            name = name.join(" ").trim();
            if (botStorage.currentGame.bosses.contains(name)){
                client.say(channel, `That boss is already in the list, type !rb boss change ${game}, to change into it.`);
                return;
            } else {
                if (name !== undefined || name !== null || name.length !== 0){
                    botStorage.currentGame.bosses.add(emptyBoss(name));
                    changeBoss(name);
                }
            }
        },
        change: function (channel, tags, name){
            name = name.join(" ").trim();

            client.say(channel, changeBoss(name) ? `Boss changed to ${name}` : `Boss ${name} not found.`)
        }
    }
}