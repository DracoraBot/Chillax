const Command = require('../../structures/Command');
const { list } = require('../../util/Util');
const names = require('../../assets/json/name');
const all = [].concat(names.male, names.female);
const genders = ['male', 'female'];
const { MessageEmbed } = require('discord.js');

module.exports = class NameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name',
			group: 'random-res',
			memberName: 'name',
			description: 'Responds with a random name, with the gender of your choice.',
			args: [
				{
					key: 'gender',
					prompt: `Which gender do you want to generate a name for? Either ${list(genders, 'or')}.`,
					type: 'string',
					default: 'male',
					oneOf: genders,
					parse: gender => gender.toLowerCase()
				}
			]
		});
	}

	run(msg, { gender }) {
		let genderSign = [];
		let color = [];
		if (gender == "male") {
			color = "#00ffff";
			genderSign = '♂️';
		} else {
			color = "#ff00ff";
			genderSign = '♀️'
		}

		const lastName = names.last[Math.floor(Math.random() * names.last.length)];
		const embed = new MessageEmbed()
			.setTitle(`${genderSign} | Name | ${genderSign}`)
			.setColor(color)
			.setDescription(`${names[gender][Math.floor(Math.random() * names[gender].length)]} ${lastName}`)
		return msg.say(embed);
	}
};
