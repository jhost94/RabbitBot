var botConf;
var botReferenceCommand;

const options = {
	options: {
		debug: true
	},
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: null,
		password: null
	},
	channels: null
}

const client = new tmi.client(options);
let botStorage = getStoragedBot();
let commandFunctionality = mainCommandModule();
let botMaintenance = botMaintenanceModule();
let commands = {
	//bitjs: commandFunctionality.bitjs,
	//test: test,
	commands: commandFunctionality.cmd,
	//setname: commandFunctionality.setTitleName,
	//setvalue: commandFunctionality.setTitleValue,
	death: commandFunctionality.deathCounterCommandCaller,
	game: commandFunctionality.gameCommandCaller,
	boss: commandFunctionality.bossCommandCaller
}

function botMaintenanceModule() {
	return {
		startUp: function () {
			botReferenceCommand = botConf.accountSettings.command;
			client.connect();

			client.on('message', (channel, tags, message, self) => {
				var success = true;
				// Ignore echoed messages.
				if (self) return;

				var command = message.split(" ");
				var cmdArray = command.slice(2);
				if (command[0].toLowerCase() === botReferenceCommand) {
					if (commands.hasOwnProperty(command[1])) {
						success = commands[command[1]](channel, tags, cmdArray);
					} else if (command.length > 1) {
						client.say(channel, `@${tags.username} thats an invalid command. Use ${botConf.accountSettings.command} <${Object.keys(commands)}> commands to get a list of all commands - WIP`)
						success = false;
					}
				}
				if (success) {
					this.saveToLocalStorage(botStorage);
					this.quickRefresh();
				}
			});
		},
		//Storage management
		saveToLocalStorage: function (bot) {
			localStorage.setItem("rabbot", JSON.stringify(bot));
		},
		quickRefresh: function () {
			//NEED FIX
			renderTotalDValue(botStorage.currentGame.deathCounter);
			renderGameName(botStorage.currentGame.name);

			if (botStorage.currentGame.currentBoss !== undefined &&
				!botStorage.currentGame.currentBoss.defeated &&
				botStorage.currentGame.showBoss) {
				console.log("Did refresh!")
				refreshBossRender(botStorage.currentGame.currentBoss.name,
					botStorage.currentGame.currentBoss.deaths);
			}
		},
		checkFile: function () {
			setTimeout(() => {
				if (botConf !== {} && botConf !== undefined && botConf !== null) {
					this.setupConfig();
					this.startUp();
				} else {
					console.error("Config file not found!");
					//FIX
					renderGameName("Config file not loaded");
					renderTotalDValue("");
				}
			}, 0)
		},
		getConf: function (conf) {
			let that = this;
			var request = new XMLHttpRequest();
			request.responseType = "json"
			request.open("GET", conf, true);
			request.send(null);
			request.onload = function (event) {
				botConf = event.currentTarget.response;
				console.log(botConf);
				that.checkFile();
			}
		},
		setupConfig: function () {
			options.identity.username = botConf.botSettings.username;
			options.identity.password = botConf.botSettings.password;
			options.channels = botConf.accountSettings.channel;
		},

		//Wire the bot to the channel
		connectBot: function () {
			if (botStorage.currentGame.name) {
				renderGameName(botStorage.currentGame.name);
				renderTotalDValue(botStorage.currentGame.deathCounter);

				if (botStorage.currentGame.showBoss) {
					bossCommands.show()
				}
			}
			botMaintenance.getConf("./config.json");
			//botMaintenance.checkFile();
		}
	}
}

/**
 * Command functionality
*/
function mainCommandModule() {

	function saveCurrentGameToList() {
		let gameID = searchGameByName(botStorage.currentGame.name);
		if (gameID != -1){
			botStorage.games[gameID] = botStorage.currentGame;
		}
	}

	function searchGameByName(game) {
		for (let i = 0; i < botStorage.gameID; i++) {
			if (botStorage.games[i] !== undefined && botStorage.games[i].name === game) {
				return i;
			}
		}
		return -1;
	}


	return {
		//Tests
		bitjs: function (channel, tags, message) {
			client.action(channel, message.join(" "));
			//client.say(channel, `/me sup bitjs`);
		},
		test: function (channel, tags, command) {
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
		cmd: function (channel) {
			client.say(channel, `The full list of commands: ${Object.keys(commands)}`);
		},
		//Change the Title Name and Value
		setGameName: function (channel, tags, message) {
			renderGameName(message[0]);
			client.say(channel, "Game name changed to " + message[0]);
		},
		//DeathCounter
		deathCounterCommandCaller: function (channel, tags, message) {
			let success = true;
			if (message.length !== 0) {
				if (deathCounterCommands.hasOwnProperty(message[0])) {
					success = deathCounterCommands[message[0]](channel, tags, message.slice(1));
					if (success) {
						client.say(channel, `${channel.slice(1)} has died ${botStorage.currentGame.deathCounter} times.`);
					}
				} else {
					client.say(channel, `@${tags.username} that command is invalid.`);
				}

				if (success) saveCurrentGameToList();
				return success;
			}
		},
		//Game
		gameCommandCaller: function (channel, tags, message) {
			let success = true;
			if (message.length !== 0) {
				if (gameCommands.hasOwnProperty(message[0])) {
					success = gameCommands[message[0]](channel, tags, message.slice(1));
				} else {
					client.say(channel, `@${tags.username} that command is invalid.`);
					success = false;
				}
			}
			if (success) saveCurrentGameToList();
			return success;
		},
		//Boss
		bossCommandCaller: function (channel, tags, message) {
			console.log(message);
			let success = true;
			if (message.length !== 0) {
				if (bossCommands.hasOwnProperty(message[0])) {
					success = bossCommands[message[0]](channel, tags, message.slice(1));
				} else {
					client.say(channel, `@${tags.username} that command is invalid.`);
					success = false;
				}
			}
			console.log(success)
			if (success) saveCurrentGameToList();
			return success;
		}
	}

}

/**
 * Get/create the storage for the bot in LocalStorage
 */
function getStoragedBot() {
	return localStorage.getItem("rabbot") !== null ? JSON.parse(localStorage.getItem("rabbot")) :
		{
			currentGame: {},
			games: {},
			subs: 0, //For now will check only the number of subs
			followers: 0, //For now will check only the number of folowers
			gameID: 0
		};
}