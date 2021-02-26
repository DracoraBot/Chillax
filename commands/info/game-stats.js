const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/Util');
const db = require('quick.db');

module.exports = class GameStatsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'game-stats',
			aliases: ['user-stats', 'gs'],
			group: 'info',
			memberName: 'gamestats',
			description: 'Display a more detailed game stats embed.',
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

		// Get database info
		const commandRan = await db.get(`commands_${user.id}`);
		const winStreak = await db.get(`streak_${user.id}`);
		const gamesWon = await db.get(`won_${user.id}`);
    const gamesPlayed = await db.get(`played_${user.id}`);
		const cookies = await db.get(`cookies_${user.id}.received`);
		const kissSent = await db.get(`kiss_${user.id}.sent`);
		const hugs = await db.get(`hugs_${user.id}.sent`);
		const rolePlayed = await db.get(`roleplay_${user.id}`);
		const profanity = await db.get(`profanity_${user.id}`);
		const globalMessages = await db.get(`messages_${user.id}`);
		const serverMessages = await db.get(`messages_${msg.guild.id}_${user.id}`);
    const noU = await db.get(`noU_${user.id}`);
    if (noU === null) db.set(`noU_${user.id}`, 0);
		if (profanity === null) db.set(`profanity_${user.id}`, 0);
		if (hugs === null) db.set(`hugs_${user.id}.sent`, 0);
		if (rolePlayed === null) db.set(`roleplay_${user.id}`, 0);
		if (cookies === null) db.set(`cookies_${user.id}`, 0);
   	if (commandRan === null) db.set(`commands_${user.id}`, 0);
    if (winStreak === null) db.set(`streak_${user.id}`, 0);
    if (gamesPlayed === null) db.set(`played_${user.id}`, 0);
   	if (gamesWon === null) db.set(`won_${user.id}`, 0);
		if (kissSent === null) db.set(`kiss_${user.id}.sent`, 0);
		if (serverMessages === null) db.set(`messages_${msg.guild.id}_${user.id}`, 0)
		if (globalMessages === null) db.set(`messages_${user.id}`, 0)
    	const ratio = gamesWon/gamesPlayed;



					const embed = new MessageEmbed()
							.setAuthor(user.tag)
							.addField('❯ Games Stats', `Commands: ${commandRan}\nGames Won: ${gamesWon}\nGames Played: ${gamesPlayed}\nStreak: ${winStreak}\nRatio: ${ratio.toFixed(2)}`, true)
							.addField('❯ Roleplay Stats', `Cookies: ${cookies}\nHugs: ${hugs}\nKiss: ${kissSent}\nCry: SOON`, true)
							.addField('❯ Other Stats', `No u: ${noU}\nTables Flipped: 0\nProfanities: ${profanity}\nGlobal Messages: ${globalMessages}\nServer Messages: ${serverMessages}`, true)
							.setColor(msg.guild.me.displayHexColor);
				return msg.embed(embed);
		}
};
