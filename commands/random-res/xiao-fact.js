const Command = require('../../structures/Command');
const facts = require('../../assets/json/chillax-fact');

module.exports = class ChillaxFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chillax-fact',
			aliases: ['iao-fact', 'bot-fact', 'easter-egg'],
			group: 'random-res',
			memberName: 'chillax-fact',
			description: 'Responds with a random fact about Chillax.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
