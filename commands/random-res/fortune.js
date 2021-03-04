const Command = require('../../structures/Command');
const fortunes = require('../../assets/json/fortune');
const { MessageEmbed } = require('discord.js');

module.exports = class FortuneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			aliases: ['fortune-cookie'],
			group: 'random-res',
			memberName: 'fortune',
			description: 'Responds with a random fortune.'
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(`${fortunes[Math.floor(Math.random() * fortunes.length)]}`)
			.setFooter(`${Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)).join(', ')}`);
		return msg.say(embed);
	}
};
