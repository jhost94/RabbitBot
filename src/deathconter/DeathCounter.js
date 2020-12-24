let deathCounterCommands = {
    add: add,
    set: set
}

//DeathCounter commands
function add(){
    checkDeathCounter();
    botStorage.deathCounter++;
}

function set(channel, tags, n){
    checkDeathCounter();
    n = parseInt(n[0], 10);
    if (typeof n === "number"){
        botStorage.deathCounter = n;
    } else {
        console.log("n is not a number, n is " + typeof n);
    }
}

//DeathCounter storage management
function checkDeathCounter(){
    if (botStorage.deathCounter === undefined || botStorage.deathCounter === null){
        botStorage.deathCounter = 0;
    }
}