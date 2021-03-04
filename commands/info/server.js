const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { owner } = require('../../assets/json/emojis');
const { formatDate } = require('../../util/Util');
const { stripIndent } = require('common-tags');
const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	VERY_HIGH: 'Highest'
};
const region = {
  'us-central': ':flag_us:  `US Central`',
  'us-east': ':flag_us:  `US East`',
  'us-south': ':flag_us:  `US South`',
  'us-west': ':flag_us:  `US West`',
  'europe': ':flag_eu:  `Europe`',
  'singapore': ':flag_sg:  `Singapore`',
  'japan': ':flag_jp:  `Japan`',
  'russia': ':flag_ru:  `Russia`',
  'hongkong': ':flag_hk:  `Hong Kong`',
  'brazil': ':flag_br:  `Brazil`',
  'sydney': ':flag_au:  `Sydney`',
  'southafrica': '`South Africa` :flag_za:'
};
module.exports = class ServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			aliases: ['guild', 'server-info', 'guild-info'],
			group: 'info',
			memberName: 'server',
			description: 'Responds with detailed information on the server.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		let oldmem = msg.guild.members.cache
      .filter((m) => !m.user.bot)
      .sort((a, b) => a.user.createdAt - b.user.createdAt)
      .first();
    let newmem = msg.guild.members.cache
      .filter((m) => !m.user.bot)
      .sort((a, b) => b.user.createdAt - a.user.createdAt)
      .first();

    // Get roles count
    const roleCount = msg.guild.roles.cache.size - 1; // Don't count @everyone

		const channels = msg.guild.channels.cache.array();
		const channelCount = channels.length;
		const textChannels =
			channels.filter(c => c.type === 'text' && c.viewable).sort((a, b) => a.rawPosition - b.rawPosition);
		const voiceChannels = channels.filter(c => c.type === 'voice').length;
		const newsChannels = channels.filter(c => c.type === 'news').length;
		const categoryChannels = channels.filter(c => c.type === 'category').length;

		const serverStats = stripIndent`
      Members  :: [ ${msg.guild.memberCount} ]
      Channels :: [ ${channelCount} ]
               :: ${textChannels.length} Text
               :: ${voiceChannels} Voice
               :: ${newsChannels} Announcement
               :: ${categoryChannels} Category
      Roles    :: [ ${roleCount} ]
    `;
		if (!msg.guild.members.cache.has(msg.guild.ownerID)) await msg.guild.members.fetch(msg.guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayHexColor)
			.setTitle(`${msg.guild.name}'s Information'`)
			.setThumbnail(msg.guild.iconURL({ format: 'png' }))
			.addField('❯ Basic Information', `
			Name: \`${msg.guild.name}\`
			Owner: ${msg.guild.owner}${owner}
			Region: ${region[msg.guild.region]}
			Verified: \`${msg.guild.verified}\`
			Partnered: \`${msg.guild.partnered}\`\n
			**❯ Additional Information**
			ID: \`${msg.guild.id}\`
			Explicit Filter: ${filterLevels[msg.guild.explicitContentFilter]}
			Verification Level: ${verificationLevels[msg.guild.verificationLevel]}
			Creation Date: ${moment(msg.guild.createdAt).format('MMM DD YYYY')}
			`, true)
			.addField('❯ Guild Information', `
			Boosts: \`${msg.guild.premiumSubscriptionCount || 0}\`
			Boost Tier: \`${msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None'}\`
			Members: \`${msg.guild.memberCount}\`
			Roles: \`${msg.guild.roles.cache.size}\`
			Channels: \`${msg.guild.channels.cache.filter(channel => channel.type !== 'category').size}\`\n
			**❯ Other Information**
			Youngest User: \`${newmem.user.tag}(${formatDate(newmem.user.createdAt)})\`
			Oldest User: \`${oldmem.user.tag}(${formatDate(oldmem.user.createdAt)})\`
			`, true)
			.addField('Server Stats', `\`\`\`asciidoc\n${serverStats}\`\`\``)

		return msg.embed(embed);
	}
};
