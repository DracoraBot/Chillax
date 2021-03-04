const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class BoredomCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'boredom',
			aliases: ['bored'],
			group: 'random-res',
			memberName: 'boredom',
			description: 'Responds with a random activity to try when you\'re bored.',
			credit: [
				{
					name: 'Bored API',
					url: 'https://www.boredapi.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://www.boredapi.com/api/activity/');
			const embed = new MessageEmbed()
				.setColor(msg.guild.me.displayHexColor)
				.setAuthor(`${body.type} Activity`, 'https://www.boredapi.com/api/activity/')
				.setDescription(`${body.activity}`)
			return msg.say(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
