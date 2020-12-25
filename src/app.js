const options = {
    options: { 
		debug: true 
	},
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: botName,
		password: oauth
	},
	channels: channel
}

let botConnected = false;
const client = new tmi.client(options);
let botStorage = getStoragedBot();

let commands = {
	//bitjs: bitjs,
	//test: test,
	commands: cmd,
	//setname: setTitleName,
	//setvalue: setTitleValue,
	death: deathCounterCommandCaller,
    setgame: showGameName   //Temp solution
}

client.connect();

client.on('message', (channel, tags, message, self) => {
	
	// Ignore echoed messages.
	if(self) return;

	var command = message.toLowerCase().split(" ");
	var cmdArray = command.slice(2);
	if(command[0] === '!rb') {
		/*
		if(!botConnected){
			connectBot(channel);
		}*/
		if(commands.hasOwnProperty(command[1])){
			commands[command[1]](channel, tags, cmdArray);
		} else if (command.length > 1){
			client.say(channel, `@${tags.username} thats an invalid command. Use ${baseCommand} commands to get a list of all commands - WIP`)
		}
		saveToLocalStorage(botStorage);
	}

});

/**
 * Command functionality
*/

//Tests
function bitjs(channel, tags){
	client.say(channel, `@${tags.username} sup bitjs`);
}

function test(channel, tags, command){
	if (tags.badges.broadcaster){
		client.say(channel, `@${tags.username} yes lord?`)
	} else {
		client.say(channel, `This is a test`);
	}
	//console.log(localStorage);
	console.log(tags);
	//console.log(channel);
	//console.log(client);
	botStorage.test != undefined ? botStorage.test++ : botStorage.test = 0;
	saveToLocalStorage(botStorage);
	renderTitleValue(botStorage.test);
	client.say(channel, "Test counter: " + botStorage.test);
}


/**
 * Commands Functionality
 */

//Send the list of commands
function cmd(channel) {
	client.say(channel, `The full list of commands: ${Object.keys(commands)}`);
}

//Change the Title Name an Value
function setTitleName(channel, tags, message) {
	renderTitleName(message[0]);
	client.say(channel, "Name changed to " + message[0]);
}

function setTitleValue(channel, tags, message) {
	renderTitleValue(message[0]);
	client.say(channel, "Title value set to " + message[0]);
}

//DeathCounter
function deathCounterCommandCaller(channel, tags, message){
	checkDeathCounter();
	if(message.length !== 0){
		if (deathCounterCommands.hasOwnProperty(message[0])){
			deathCounterCommands[message[0]](channel, tags, message.slice(1));
			client.say(channel, `${channel.slice(1)} has died ${botStorage.deathCounter} times.`);
		}
	}
}

//Wire the bot to the channel
function connectBot(channel){
	renderTitleName(channel.slice(1));
	botConnected = true;
}

//Storage management
function getStoragedBot(){
	return localStorage.getItem("rabbot") !== null ? JSON.parse(localStorage.getItem("rabbot")) :
	{
		game:[],
		subs: 0, //For now will check only the number of subs
		folowers: 0 //For now will check only the number of folowers
	};
}

function saveToLocalStorage(bot){
	localStorage.setItem("rabbot", JSON.stringify(bot));
}