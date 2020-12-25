let deathCounterCommands = {
    add: add,
    set: set
}

//DeathCounter commands
function add(){
    checkDeathCounter();
    botStorage.deathCounter++;
    showDeathCounter();
}

function set(channel, tags, n){
    checkDeathCounter();
    n = parseInt(n[0], 10);
    if (typeof n === "number"){
        botStorage.deathCounter = n;
    } else {
        console.log("n is not a number, n is " + typeof n);
    }
    showDeathCounter();
}

//DeathCounter storage management
function checkDeathCounter(){
    showDeathCounter();
    if (botStorage.deathCounter === undefined || botStorage.deathCounter === null){
        botStorage.deathCounter = 0;
    }
}

//Show the game and deaths on screen
function showGameName(channel, tags, name){
    name = name[0];
    renderTitleName(name);
}

function showDeathCounter(){
    renderTitleValue(botStorage.deathCounter);
}