const Command = require('../../structures/Command');
const teachings = require('../../assets/json/axis-cult');
const { MessageEmbed } = require('discord.js');

module.exports = class AxisCultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'axis-cult',
			aliases: ['axis', 'axis-pray'],
			group: 'random-res',
			memberName: 'axis-cult',
			description: 'Responds with a teaching of the Axis Cult.',
			credit: [
				{
					name: 'Axis Order Bot',
					url: 'https://www.reddit.com/r/axisorderbot/wiki/index',
					reason: 'Prayer Data'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Original Anime'
				}
			]
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.addField(`${teachings[Math.floor(Math.random() * teachings.length)]}`)
		return msg.say(embed);
	}
};
