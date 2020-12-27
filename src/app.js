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

const client = new tmi.client(options);
let botStorage = getStoragedBot();
let commandFunctionality = mainCommandModule();
let commands = {
	//bitjs: commandFunctionality.bitjs,
	//test: test,
	commands: commandFunctionality.cmd,
	//setname: commandFunctionality.setTitleName,
	//setvalue: commandFunctionality.setTitleValue,
	death: commandFunctionality.deathCounterCommandCaller,
	game: commandFunctionality.gameCommandCaller
}

client.connect();

client.on('message', (channel, tags, message, self) => {

	// Ignore echoed messages.
	if (self) return;

	var command = message.toLowerCase().split(" ");
	var cmdArray = command.slice(2);
	if (command[0] === '!rb') {
		if (commands.hasOwnProperty(command[1])) {
			commands[command[1]](channel, tags, cmdArray);
		} else if (command.length > 1) {
			client.say(channel, `@${tags.username} thats an invalid command. Use ${baseCommand} commands to get a list of all commands - WIP`)
		}
		saveToLocalStorage(botStorage);
	}

});

/**
 * Command functionality
*/
function mainCommandModule() {
	return {
		//Tests
		bitjs: function bitjs(channel, tags, message) {
			client.action(channel, message.join(" "));
			//client.say(channel, `/me sup bitjs`);
		},
		test: function test(channel, tags, command) {
			if (tags.badges.broadcaster) {
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
		},
		//Send the list of commands
		cmd: function cmd(channel) {
			client.say(channel, `The full list of commands: ${Object.keys(commands)}`);
		},
		//Change the Title Name and Value
		setTitleName: function setTitleName(channel, tags, message) {
			renderTitleName(message[0]);
			client.say(channel, "Name changed to " + message[0]);
		},
		setTitleValue: function setTitleValue(channel, tags, message) {
			renderTitleValue(message[0]);
			client.say(channel, "Title value set to " + message[0]);
		},
		//DeathCounter
		deathCounterCommandCaller: function deathCounterCommandCaller(channel, tags, message) {
			if (message.length !== 0) {
				if (deathCounterCommands.hasOwnProperty(message[0])) {
					deathCounterCommands[message[0]](channel, tags, message.slice(1));
					client.say(channel, `${channel.slice(1)} has died ${botStorage.currentGame.deathCounter} times.`);
				}
			}
		},
		//Game
		gameCommandCaller: function gameCommandCaller (channel, tags, message){
			if (message.length !== 0) {
				if (gameCommands.hasOwnProperty(message[0])){
					gameCommands[message[0]](channel, tags, message.slice(1));
				}
			}
		},
		//Wire the bot to the channel
		connectBot: function connectBot() {
			if (botStorage.currentGame.name) {
				renderTitleName(botStorage.currentGame.name);
				renderTitleValue(botStorage.currentGame.deathCounter);
			}
		}
	}

}

//Storage management
function getStoragedBot() {
	return localStorage.getItem("rabbot") !== null ? JSON.parse(localStorage.getItem("rabbot")) :
		{
			currentGame: {},
			games: {},
			subs: 0, //For now will check only the number of subs
			folowers: 0 //For now will check only the number of folowers
		};
}

function saveToLocalStorage(bot) {
	localStorage.setItem("rabbot", JSON.stringify(bot));
}