//just a test to see if this will work
var rabbitBot = function(){
const tmi = require('tmi.js');
const botConfig = require('../config.js');

const options = {
    options: { 
		debug: true 
	},
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: botConfig.botName,
		password: botConfig.oauth
	},
	channels: botConfig.channel
}

let testCount = 0;


const client = new tmi.client(options);


exports.init = function(){
	
	if (options.identity){
		console.log("import failed");

		options.channels = ["jhost94"];
		options.identity.username = "princesspotato_bot";
		options.identity.password = "611w4kmblmhoebf483dkm29zwv4pax";
	}
	
	console.log("Hello world");
	console.log(botConfig.botName);
	console.log(options.identity.username);

    client.connect();
	client.on("connected", (channel, port) => {
		client.action(channel, "Hello, Rabbit bot is now in the chat!");
	});

}

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!rb') {
        // "@alca, heya!"
        //client.say(channel, "Hello World!")
        client.say(channel, `@${tags.username}, heya!`);
	}
	if(message.toLowerCase() === "!k") {
		testCount++;
		client.say(channel, `Your death count is ${testCount}`);
	}
});
}