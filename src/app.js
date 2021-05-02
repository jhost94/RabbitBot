var botConf;
var botReferenceCommand;

//Debugging purposes
var tag;

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
	cmd: commandFunctionality.cmd,
	death: commandFunctionality.deathCounterCommandCaller,
	game: commandFunctionality.gameCommandCaller,
	boss: commandFunctionality.bossCommandCaller,
	stage: commandFunctionality.stageCommandCaller
}

function botMaintenanceModule() {
	return {
		startUp: function () {
			botReferenceCommand = botConf.accountSettings.command;
			client.connect();
			client.on('message', (channel, tags, message, self) => {
				var success = false;
				// Ignore echoed messages.
				if (self) return;
				
				tag = tags;

				var command = message.split(" ");
				var cmdArray = command.slice(2);
				if (command[0].toLowerCase() === botReferenceCommand) {
					if (commands.hasOwnProperty(command[1])) {
						success = commands[command[1]](channel, tags, cmdArray);
					} else if (command.length > 1) {
						client.say(channel, `@${tags.username} thats an invalid command. Use ${botConf.accountSettings.command} <${Object.keys(commands)}> commands to get a list of all commands.`);
						success = false;
					} else {
						client.say(channel, `@${tags.username} hi, I'm alive!`);
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
				refreshBossRender(botStorage.currentGame.currentBoss.name,
					botStorage.currentGame.currentBoss.deaths);
			}

			if (botStorage.currentGame.currentStage !== undefined &&
				!botStorage.currentGame.currentStage.finished &&
				botStorage.currentGame.showStage) {
				refreshStageRender(botStorage.currentGame.currentStage.name,
					botStorage.currentGame.currentStage.deaths);
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
					hideStage();
					hideBoss();
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

				if (botStorage.currentGame.showBoss) bossCommands.show();
				if (botStorage.currentGame.showStage) stageCommands.show();
			}
			botMaintenance.getConf("./config.json");
		}
	}
}

/**
 * Command functionality
*/

function mainCommandModule() {

	function saveCurrentGameToList() {
		let gameID = searchGameByName(botStorage.currentGame.name);
		if (gameID != -1) {
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

	function canUseCommand(permission, tags) {
		if (!checkPermissionsExist()) {
			return checkBroadcaster(tags) || checkMod(tags);
		}

		permission = botConf.permissions[permission]

		switch (permition) {
			case "broadcaster":
				return checkBroadcaster(tags);
			case "mod":
				return checkMod(tags);
			case "sub":
				return checkSub(tags);
			case "viewer":
				return checkViewer(tags);
		}
	}

	function checkBroadcaster(tags) {
		console.log(tags)
		return tags.badges.broadcaster === "1";
	}

	function checkMod(tags) {
		return tags.mod;
	}

	function checkSub(tags) {
		return tags.subscriber;
	}

	function checkViewer(tags) {
		return true; //to be changed
	}

	function checkPermissionsExist() {
		return botConf.permissions !== null && botConf.permissions !== undefined;
	}


	/////////
	//Command list
	////////

	return {
		//Send the list of commands
		cmd: function (channel) {
			if (!canUseCommand("cmd", tags)) return false;

			client.say(channel, `The full list of commands: ${Object.keys(commands)}`);
		},
		//DeathCounter
		deathCounterCommandCaller: function (channel, tags, message) {
			let success = false;

			if (!canUseCommand("death", tags)) return false;


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
			} else {
				client.say(channel, `${channel} has died ${botStorage.currentGame.deathCounter} times this game.`);
				client.say(channel, `Death-counters commands: ${Object.keys(deathCounterCommands)}`);
			}
		},
		//Game
		gameCommandCaller: function (channel, tags, message) {
			let success = false;

			if (!canUseCommand("game", tags)) return false;

			if (message.length !== 0) {
				if (gameCommands.hasOwnProperty(message[0])) {
					success = gameCommands[message[0]](channel, tags, message.slice(1));
				} else {
					client.say(channel, `Game commands: ${Object.keys(gameCommands)}`);
					success = false;
				}
			}
			if (success) saveCurrentGameToList();
			return success;
		},
		//Boss
		bossCommandCaller: function (channel, tags, message) {
			let success = false;

			if (!canUseCommand("game", tags)) return false;

			if (message.length !== 0) {
				if (bossCommands.hasOwnProperty(message[0])) {
					success = bossCommands[message[0]](channel, tags, message.slice(1));
				} else {
					client.say(channel, `Boss commands: ${Object.keys(bossCommands)}`);
					success = false;
				}
			}

			if (success) saveCurrentGameToList();
			return success;
		},
		//Stage
		stageCommandCaller: function (channel, tags, message) {
			let success = false;

			if (!canUseCommand("game", tags)) return false;

			if (message.length !== 0) {
				if (stageCommands.hasOwnProperty(message[0])) {
					success = stageCommands[message[0]](channel, tags, message.slice(1));
				}
			} else {
				client.say(channel, `Stage commands: ${Object.keys(stageCommands)}`);
				success = false;
			}

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

/**
 * User roles and authorization for command uses
 * Possible roles:
 * broadcaster - badge
 * mod
 * subscriber
 * turbo
 *
*/