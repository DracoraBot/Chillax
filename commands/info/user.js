const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/Util');
const emojis = require('../../assets/json/emojis');
const db = require('quick.db');
const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} \`Discord Employee\``,
  DISCORD_PARTNER: `${emojis.discord_partner} \`Partnered Server Owner\``,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} \`Bug Hunter (Level 1)\``,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} \`Bug Hunter (Level 2)\``,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} \`HypeSquad Events\``,
  HOUSE_BRAVERY: `${emojis.house_bravery} \`House of Bravery\``,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} \`House of Brilliance\``,
  HOUSE_BALANCE: `${emojis.house_balance} \`House of Balance\``,
  EARLY_SUPPORTER: `${emojis.early_supporter} \`Early Supporter\``,
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: `${emojis.verified_bot} \`Verified Bot\``,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} \`Early Verified Bot Developer\``
};
const deprecated = ['DISCORD_PARTNER', 'VERIFIED_DEVELOPER'];

module.exports = class UserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user',
			aliases: ['user-info', 'member', 'member-info', 'profile', 'who-is', 'who'],
			group: 'info',
			memberName: 'user',
			description: 'Responds with detailed information on a user.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get information on?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		// const userFlags = user.flags ? user.flags.toArray().filter(flag => !deprecated.includes(flag)) : [];

		const userFlags = (await user.fetchFlags()).toArray();

		// Get database info
		const commandRan = await db.get(`commands_${user.id}`);
		const winStreak = await db.get(`streak_${user.id}`);
		const gamesWon = await db.get(`won_${user.id}`);
    const gamesPlayed = await db.get(`played_${user.id}`);
    const highestStreak = db.get(`highestStreak_${user.id}`);
    if (highestStreak === null) db.set(`highestStreak_${user.id}`, 0);
    if (commandRan === null) db.set(`commands_${user.id}`, 0);
    if (winStreak === null) db.set(`streak_${user.id}`, 0)
    if (gamesPlayed === null) db.set(`played_${user.id}`, 0);
    if (gamesWon === null) db.set(`won_${user.id}`, 0);
    const ratio = gamesWon/gamesPlayed;
    const ratioPer = ratio*100;
    const member = await msg.guild.members.fetch(user.id);
    const defaultRole = msg.guild.roles.cache.get(msg.guild.id);
    const today = new Date();
    const yyyy = today.getFullYear();
    // Setup fields const
    const hoist = member.roles.hoist ? member.roles.hoist.name : 'None';
    const serverJoinDate = moment(member.joinedAt).format('MMM DD YYYY')
    const discJoinDate = moment(member.user.createdAt).format('MMM DD YYYY')
    const discJoinYear = moment(member.user.createdAt).format('YYYY');
    const ageAccount = yyyy - discJoinYear;
    const highestRole = member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name;
    const hoistRole = member.roles.hoist ? member.roles.hoist.name : 'None';
    const userId = user.id;
    const isBot = user.bot ? 'Yes' : 'No';

		const embed = new MessageEmbed()
			.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setAuthor(user.tag)
      .setDescription('In a **hoisted** configuration, roles are sorted and displayed based on which role is higher in the role management menu.')
			.addField('❯ Discord Information', `
      Joined Discord On: ${discJoinDate}
      Account Age: ${ageAccount} years
      Highest: ${highestRole}
      Hoist: ${hoist}`)

			.addField('❯ User Information', `
      User: <@${user.id}>
      Username: ${user.username}
      Tag: #${user.discriminator}
      ID: ${userId}
      Joined Server On: ${discJoinDate}
      ${user.bot ? 'Bot' : ''}`)
				const roles = member.roles.cache
					.filter(role => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
				embed
          .addField('❯ Bot Stats', `
          Commands: ${commandRan}
          Games Played: ${gamesPlayed}
          Games Won: ${gamesWon}
          Win Streak: ${winStreak}
          Highest Streak: ${highestStreak}
          W/L Ratio: ${ratio.toFixed(2)} | ${ratioPer.toFixed(0)}%`)
					.addField(`❯ Roles (${roles.length})`, roles.length ? trimArray(roles, 6).join(', ') : 'None')
					.setColor(member.displayHexColor);
					if (userFlags.length > 0) embed.addField('Badges', userFlags.map(flag => flags[flag]).join('\n'));
		return msg.embed(embed);
	}
};
