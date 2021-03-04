require('dotenv').config();
const { CHILLAX_TOKEN, OWNERS, CHILLAX_PREFIX, INVITE, PERSPECTIVE_API_KEY } = process.env;
const path = require('path');
const request = require('node-superfetch');
const { Intents, MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const Client = require('./structures/Client');
const db = require('quick.db');
const client = new Client({
	commandPrefix: CHILLAX_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableMentions: 'everyone',
	partials: ['GUILD_MEMBER', 'GUILD_MESSAGES'],
	ws: { intents: [Intents.NON_PRIVILEGED, 'GUILD_MEMBERS', 'GUILD_MESSAGES'] }
});
const { formatNumber } = require('./util/Util');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util-public', 'Utility'],
		['util-voice', 'Utility (Voice)'],
		['util', 'Utility (Owner)'],
		['info', 'Discord Information'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['random-seed', 'Seeded Randomizers'],
		['single', 'Single Response'],
		['auto', 'Automatic Response'],
		['events', 'Events'],
		['search', 'Search'],
		['pokedex', 'Pokédex'],
		['analyze', 'Analyzers'],
		['games-sp', 'Single-Player Games'],
		['games-mp', 'Multi-Player Games'],
		['edit-image', 'Image Manipulation'],
		['edit-avatar', 'Avatar Manipulation'],
		['edit-meme', 'Meme Generators'],
		['edit-text', 'Text Manipulation'],
		['edit-number', 'Number Manipulation'],
		['voice', 'Play Audio'],
		['remind', 'Reminders'],
		['phone', 'Phone'],
		['code', 'Coding Tools'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false,
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);

	// Register all canvas fonts
	await client.registerFontsIn(path.join(__dirname, 'assets', 'fonts'));

	// Set up existing timers
	await client.timers.fetchAll();

	// Push client-related activities
	client.activities.push(
		{ text: () => `${formatNumber(client.guilds.cache.size)} servers`, type: 'WATCHING' },
		{ text: () => `with ${formatNumber(client.registry.commands.size)} commands`, type: 'PLAYING' },
		{ text: () => `${formatNumber(client.channels.cache.size)} channels`, type: 'WATCHING' }
	);

	// Interval to change activity every minute
	client.setInterval(() => {
		const activity = client.activities[Math.floor(Math.random() * client.activities.length)];
		const text = typeof activity.text === 'function' ? activity.text() : activity.text;
		client.user.setActivity(text, { type: activity.type });
	}, 60000);

	// Import blacklist
	try {
		const results = client.importBlacklist();
		if (!results) client.logger.error('[BLACKLIST] blacklist.json is not formatted correctly.');
	} catch (err) {
		client.logger.error(`[BLACKLIST] Could not parse blacklist.json:\n${err.stack}`);
	}

	// Make sure bot is not in any blacklisted guilds
	for (const id of client.blacklist.guild) {
		try {
			const guild = await client.guilds.fetch(id, false);
			await guild.leave();
			client.logger.info(`[BLACKLIST] Left blacklisted guild ${id}.`);
		} catch {
			if (!client.guilds.cache.has(id)) continue;
			client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${id}.`);
		}
	}

	// Make sure bot is not in any guilds owned by a blacklisted user
	let guildsLeft = 0;
	for (const guild of client.guilds.cache.values()) {
		if (client.blacklist.user.includes(guild.ownerID)) {
			try {
				await guild.leave();
				guildsLeft++;
			} catch {
				client.logger.info(`[BLACKLIST] Failed to leave blacklisted guild ${guild.id}.`);
			}
		}
	}
	client.logger.info(`[BLACKLIST] Left ${guildsLeft} guilds owned by blacklisted users.`);

	// Import command-leaderboard.json
	try {
		const results = client.importCommandLeaderboard();
		if (!results) client.logger.error('[LEADERBOARD] command-leaderboard.json is not formatted correctly.');
	} catch (err) {
		client.logger.error(`[LEADERBOARD] Could not parse command-leaderboard.json:\n${err.stack}`);
	}

	// Export command-last-run.json
	try {
		const results = client.importLastRun();
		if (!results) client.logger.error('[LASTRUN] command-last-run.json is not formatted correctly.');
	} catch (err) {
		client.logger.error(`[LASTRUN] Could not parse command-last-run.json:\n${err.stack}`);
	}

	// Export command-leaderboard.json and command-last-run.json every 30 minutes
	client.setInterval(() => {
		try {
			client.exportCommandLeaderboard();
		} catch (err) {
			client.logger.error(`[LEADERBOARD] Failed to export command-leaderboard.json:\n${err.stack}`);
		}
		try {
			client.exportLastRun();
		} catch (err) {
			client.logger.error(`[LASTRUN] Failed to export command-last-run.json:\n${err.stack}`);
		}
	}, 1.8e+6);
});

client.on('message', async msg => {
			//db.add(`messages_${msg.guild.id}`, 1);
    	db.add(`messages_${msg.author.id}`, 1);
    	db.add(`messages_${msg.guild.id}_${msg.author.id}`, 1);
	const text = msg.content;
	if (msg.content.startsWith(CHILLAX_PREFIX)) {
  const commandRan = await db.fetch(`commands_${msg.author.id}`);
		if (commandRan === null) await db.set(`commands_${msg.author.id}`, 0)
		db.add(`commands_${msg.author.id}`, 1);
	} else {
if (
		(msg.content === `<@${client.user.id}>` || msg.content === `<@!${client.user.id}>`) &&
	msg.channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
) {
	const embed = new MessageEmbed()
		.setTitle('Hi, I\'m Chillax. Need help?')
		.setThumbnail('https://static.wikia.nocookie.net/hunterxhunter/images/7/7c/Killua-2011.png')
		.setDescription(`You can see everything I can do by using the \`${CHILLAX_PREFIX}help\` command.`)
		.addField('Invite Me', oneLine`
			You can add me to your server by clicking
			[here](https://discord.com/api/oauth2/authorize?client_id=482995476187054110&permissions=8&scope=bot)!
		`)
		.addField('Support', oneLine`
			If you have questions, suggestions, or found a bug, please join the
			[Dracora Support Server](https://discord.gg/NuDZSSS)!
		`)
		.addField('Donations', oneLine`
			You can donate to us and help us grow! Use
			[Paypal](https://paypal.me/DracoraBot).
		`)
		/*
		.addField('Website', oneLine`
			For any further questions visit our [website](https://dracora.dev);
		`)
		*/
		.addField('Patreon', oneLine`
			Want to unlock more perks? Become a [Patreon](https://www.patreon.com/dracora)
		`)
		.setFooter('DM Dagger to speak directly with the developer!')
		.setColor(msg.guild.me.displayHexColor);
	return msg.channel.send(embed);
}
	const hasText = Boolean(msg.content);
	const hasImage = msg.attachments.size !== 0;
	const hasEmbed = msg.embeds.length !== 0;
	if (msg.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
        /*
	const { body } = await request
		.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
		.query({ key: PERSPECTIVE_API_KEY })
		.send({
			comment: { text },
			languages: ['en'],
			requestedAttributes: { PROFANITY: {} }
		});
	const profanity = Math.round(body.attributeScores.PROFANITY.summaryScore.value * 100);
	if (profanity >= 90) {
		db.add(`profanity_${msg.author.id}`, 1);
	} else {
		return;
	}
    */
	if (client.blacklist.user.includes(msg.author.id)) return;
	const origin = client.phone.find(call => call.origin.id === msg.channel.id);
	const recipient = client.phone.find(call => call.recipient.id === msg.channel.id);
	if (!origin && !recipient) return;
	const call = origin || recipient;
	if (call.originDM && call.startUser.id !== msg.author.id) return;
	if (!call.adminCall && (msg.guild && (!msg.channel.topic || !msg.channel.topic.includes('<chillax:phone>')))) return;
	if (!call.active) return;
	if (call.adminCall && msg.guild.id === call.origin.guild.id && !client.isOwner(msg.author)) return;
	try {
		await call.send(origin ? call.recipient : call.origin, msg, hasText, hasImage, hasEmbed);
	} catch {
		return; // eslint-disable-line no-useless-return
	}
}
});

client.on('guildCreate', async guild => {
	if (client.blacklist.guild.includes(guild.id) || client.blacklist.user.includes(guild.ownerID)) {
		try {
			await guild.leave();
			return;
		} catch {
			return;
		}
	}
	if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		try {
			const usage = client.registry.commands.get('help').usage();
			await guild.systemChannel.send(`Hi! I'm Chillax, use ${usage} to see my commands, yes?`);
		} catch {
			// Nothing!
		}
	}
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		if (!guild.members.cache.has(guild.ownerID)) await guild.members.fetch(guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount))
			.addField('❯ Owner', guild.owner.user.tag);
		await joinLeaveChannel.send({ embed });
	}
});

client.on('guildDelete', async guild => {
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const embed = new MessageEmbed()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount))
			.addField('❯ Owner', guild.ownerID);
		await joinLeaveChannel.send({ embed });
	}
});

client.on('guildMemberRemove', async member => {
	if (member.id === client.user.id) return null;
	const channel = member.guild.systemChannel;
	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;
	if (channel.topic && channel.topic.includes('<chillax:disable-leave>')) return null;
	try {
		const leaveMessage = client.leaveMessages[Math.floor(Math.random() * client.leaveMessages.length)];
		await channel.send(leaveMessage.replaceAll('{{user}}', `**${member.user.tag}**`));
		return null;
	} catch {
		return null;
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.id !== client.user.id || oldState.id !== client.user.id) return;
	if (newState.channel) return;
	const dispatcher = client.dispatchers.get(oldState.guild.id);
	if (!dispatcher) return;
	dispatcher.end();
	client.dispatchers.delete(oldState.guild.id);
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	client.exportCommandLeaderboard();
	client.exportLastRun();
	process.exit(0);
});

client.on('error', err => client.logger.error(err.stack));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandRun', (msg, command) => {
	if (command.uses === undefined) return;
	command.uses++;
	if (command.lastRun === undefined) return;
	command.lastRun = new Date();
});

client.dispatcher.addInhibitor(msg => {
	if (client.blacklist.user.includes(msg.author.id)) return 'blacklisted';
	if (msg.guild && client.blacklist.guild.includes(msg.guild.id)) return 'blacklisted';
	return false;
});

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(CHILLAX_TOKEN);
