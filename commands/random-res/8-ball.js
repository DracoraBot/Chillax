const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/8-ball');
const { MessageEmbed } = require('discord.js');

module.exports = class EightBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8-ball',
			aliases: ['magic-8-ball', 'eight-ball', 'magic-eight-ball'],
			group: 'random-res',
			memberName: '8-ball',
			description: 'Asks your question to the Magic 8 Ball.',
			credit: [
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Original Concept',
					reasonURL: 'https://www.mattelgames.com/games/en-us/kids/magic-8-ball'
				}
			],
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the 8 ball?',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		const embed = new MessageEmbed()
			.setTitle('🎱 | 8 Ball | 🎱')
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(stripIndents`
				Question: _${question}_
				Answer: ${answers[Math.floor(Math.random() * answers.length)]}
				`)
		return msg.say(embed);
	}
};
