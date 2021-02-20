const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['paypal'],
			group: 'util-public',
			memberName: 'donate',
			description: 'Responds with the bot\'s donation links.',
			guarded: true,
			credit: [
				{
					name: 'PayPal',
					url: 'https://www.paypal.com/us/home',
					reason: 'Donation Gathering'
				}
			]
		});
	}

	run(msg) {
		msg.channel.send({embed: {
    color: msg.guild.me.displayHexColor,
    author: {
      name: this.client.user.username,
      icon_url: this.client.user.displayAvatarURL
    },
    title: "Contribute To Chillax",
    url: "https://paypal.me/DracoraBot",
    fields: [{
        name: "Paypal",
        value: "You can put donate [here](https://paypal.me/DracoraBot)."
      },
      {
        name: "Bitcoins",
        value: "173z1LdpV6DcC9hFNBHnPdbktf7rp4uyuF"
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: this.client.user.displayAvatarURL,
      text: "© Chillax Bot"
    }
  }
});
	}
};
