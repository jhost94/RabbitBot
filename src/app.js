
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

let testCount = 0;

const client = new tmi.client(options);
	
	if (!options.identity.username){
		console.log("import failed");

		options.channels = ["jhost94"];
		options.identity.username = "princesspotato_bot";
		options.identity.password = "611w4kmblmhoebf483dkm29zwv4pax";
	}

	client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!rb') {
        // "@alca, heya!"
        client.say(channel, `@${tags.username}, heya!`);
	}
	if(message.toLowerCase() === "!k") {
		testCount++;
		client.say(channel, `Your death count is ${testCount}`);
	}
});