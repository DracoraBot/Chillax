const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/magic-conch');
const { MessageEmbed } = require('discord.js');

module.exports = class MagicConchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magic-conch',
			aliases: ['magic-conch-shell', 'conch'],
			group: 'random-res',
			memberName: 'magic-conch',
			description: 'Asks your question to the Magic Conch.',
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
				}
			],
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the magic conch?',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		const embed = new MessageEmbed()
			.setTitle(`🐚 | Magic Conch  | 🐚`)
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(stripIndents`
				Q:_${question}_
				A: 🐚 ${answers[Math.floor(Math.random() * answers.length)]} 🐚
			`)
	}
};
