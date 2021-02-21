const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const permissions = require('../../assets/json/permissions');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
module.exports = class CookieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cookie',
			group: 'util-public',
			memberName: 'cookie',
			description: 'Give a cookie to a user!',
      args: [
        {
          key: 'target',
          prompt: 'Who do you want to give a cookie to?',
          type: 'user'
        }
      ]
		});
	}

	async run(msg, { target }) {
    const sent = await db.fetch(`cookie_${msg.author.id}.sent`);
    const recieved = await db.fetch(`cookie_${msg.author.id}.recieved`);
		const targetR = await db.fetch(`cookie_${target.id}.recieved`);
    //if (sent === null) db.set(`cookie_${msg.author.id}.sent`, 0);
    //if (recieved === null) db.set(`cookie_${msg.author.id}.recieved`, 0);

    const embed = new MessageEmbed()
      .setTitle(`Cookie Sent`)
      .setDescription(`**${msg.author}** sent a cookie to **${target}**!`)
      .addField('Sent', sent, true)
      .addField('Recieved', recieved, true)
      .setColor(msg.guild.me.displayHexColor)
    return msg.say(embed)
		await db.add(`cookie_${msg.author.id}.sent`, 1);
		await db.add(`cookie_${target.id}.recieved`, 1);
	}
};
