
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

let commands = {
	bitjs: bitjs,
	test: test,
	commands: cmd,
	setname: setTitleName,
	setvalue: setTitleValue
}
/*
	if (!options.identity.username){
		console.log("import failed");
	}
*/
	client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	var command = message.toLowerCase().split(" ");
	if(command[0] === '!rb') {
        // "@alca, heya!"
		//client.say(channel, `@${tags.username}, heya!`);
		if(commands.hasOwnProperty(command[1])){
			commands[command[1]](channel, tags, command[2]);
		} else {
			client.say(channel, `@${tags.username} thats an invalid command. Use ${baseCommand} commands to get a list of all commands - WIP`)
		}
	}

});

//Command functionality

function bitjs(channel, tags){
	client.say(channel, `@${tags.username} sup bitjs`);
}

function test(channel){
	client.say(channel, `This is a test`);
}

function cmd(channel) {
	client.say(channel, `The full list of commands: ${Object.keys(commands)}`);
}

function setTitleName(channel, tags, message) {
	renderTitleName(message);
	client.say(channel, "Name changed to " + message);
}

function setTitleValue(channel, tags, message) {
	renderTitleValue(message);
	client.say(channel, "Title value set to " + message);
}