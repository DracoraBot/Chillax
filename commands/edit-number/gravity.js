const Command = require('../../structures/Command');
const { list, firstUpperCase, formatNumber } = require('../../util/Util');
const { planets } = require('../../assets/json/planet');
const { MessageEmbed } = require('discord.js');
module.exports = class GravityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravity',
			group: 'edit-number',
			memberName: 'gravity',
			description: 'Determines weight on another celestial object.',
			details: `**Celestial Objects:** ${Object.keys(planets).join(', ')}`,
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'Planet Gravity Data',
					reasonURL: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html'
				}
			],
			args: [
				{
					key: 'weight',
					prompt: 'What should the starting weight be (in KG)?',
					type: 'float'
				},
				{
					key: 'planet',
					prompt: 'What planet do you want to find? You can enter the name, symbol, or atomic number.',
					type: 'string',
					validate: planet => {
						const search = planet.toString().toLowerCase();
						if (planets.find(a => a.name.toLowerCase() === search || a.link.toLowerCase() === search)) return true;
						return 'Invalid planet, please enter a valid planet symbol, name, or atomic number.';
					},
					parse: planet => {
						const search = planet.toLowerCase();
						return planets.find(a => a.name.toLowerCase() === search);
					}
				}
			]
		});
	}

	run(msg, { weight, planet }) {
		const embed = new MessageEmbed()
			.setTitle('Gravity Calculator')
			.setColor(msg.guild.me.displayHexColor)
			.setImage(planet.image)
			.setDescription(`${formatNumber(weight)} kg on ${firstUpperCase(planet)} is ${formatNumber(result)} kg.`)
		const result = weight * planet.gravity;
		return msg.say(embed)
	}
};
