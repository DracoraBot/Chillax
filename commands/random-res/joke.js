const Command = require('../../structures/Command');
const jokes = require('../../assets/json/joke');
const { MessageEmbed } = require('discord.js');

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joke',
			group: 'random-res',
			memberName: 'joke',
			description: 'Responds with a random joke.'
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(`${jokes[Math.floor(Math.random() * jokes.length)]}`)
		return msg.say(embed;
	}
};
