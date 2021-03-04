const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class GithubZenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github-zen',
			aliases: ['gh-zen'],
			group: 'random-res',
			memberName: 'github-zen',
			description: 'Responds with a random GitHub design philosophy.',
			credit: [
				{
					name: 'GitHub',
					url: 'https://github.com/',
					reason: 'Zen API',
					reasonURL: 'https://developer.github.com/v3/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('https://api.github.com/zen');
			const embed = new MessageEmbed()
				.setTitle(`Github Zen`)
				.setColor(msg.guild.me.displayHexColor)
				.setDescription(text)
			return msg.say(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
