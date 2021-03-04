const Command = require('../../structures/Command');
const compliments = require('../../assets/json/compliment');
const { MessageEmbed } = require('discord.js');

module.exports = class ComplimentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'compliment',
			group: 'random-res',
			memberName: 'compliment',
			description: 'Compliments a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to compliment?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(`${user.username}, ${compliments[Math.floor(Math.random() * compliments.length)]}`)
		return msg.say(embed);
	}
};
