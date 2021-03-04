const Command = require('../../structures/Command');
const { safe, nsfw } = require('../../assets/json/never-have-i-ever');
const all = [...safe, ...nsfw];
const { MessageEmbed } = require('discord.js');
module.exports = class NeverHaveIEverCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'never-have-i-ever',
			aliases: ['nhie', 'never-have-i', 'never-have', 'never-ever'],
			group: 'random-res',
			memberName: 'never-have-i-ever',
			description: 'Responds with a random "Never Have I Ever..." statement.',
			credit: [
				{
					name: 'PsyCat Games',
					url: 'https://psycatgames.com/',
					reason: 'Statement Data',
					reasonURL: 'https://psycatgames.com/app/never-have-i-ever/'
				}
			]
		});
	}

	async run(msg) {
        const nhie = new MessageEmbed()
        	.setDescription(all[Math.floor(Math.random() * all.length)])
        	.setColor(msg.guild.me.displayHexColor)
					.setFooter(`NSFW: Enabled`);

        const safeNhie = new MessageEmbed()
					.setDescription(safe[Math.floor(Math.random() * safe.length)])
          .setColor(msg.guild.me.displayHexColor)
					.setFooter(`NSFW: Disabled`);

		if (msg.channel.nsfw) return msg.channel.send({embed: nhie}).then(embedMessage => {
    embedMessage.react("✅")
    embedMessage.react("❌")
})
return msg.channel.send({embed: safeNhie}).then(embedMessage => {
    embedMessage.react("✅")
    embedMessage.react("❌")
});
    }
};
