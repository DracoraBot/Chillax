const Command = require('../../structures/Command');
const sides = ['heads', 'tails'];
const { MessageEmbed } = require('discord.js');

module.exports = class CoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coin',
			aliases: ['coin-flip', 'flip'],
			group: 'random-res',
			memberName: 'coin',
			description: 'Flips a coin.'
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(`I flipped a coin and it landed on ${sides[Math.floor(Math.random() * sides.length)]}!`)
		return msg.say(embed);
	}
};
