const Command = require('../../structures/Command');
const facts = require('../../assets/json/fact-core');
const { MessageEmbed } = require('discord.js');

module.exports = class FactCoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fact-core',
			group: 'random-res',
			memberName: 'fact-core',
			description: 'Responds with a random Fact Core quote.',
			credit: [
				{
					name: 'Valve',
					url: 'https://www.valvesoftware.com/en/',
					reasonURL: 'http://www.thinkwithportals.com/',
					reason: 'Original "Portal 2" Game'
				}
			]
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setTitle(`Fact Core`)
			.setColor(msg.guild.me.displayHexColor)
			.setDescription(`${facts[Math.floor(Math.random() * facts.length)]}`)
		return msg.say(embed);
	}
};
