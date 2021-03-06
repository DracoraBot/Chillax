const Command = require('../../structures/Command');
const Battle = require('../../structures/battle/Battle');
const { randomRange, verify } = require('../../util/Util');
const { createCanvas } = require('canvas');
const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'.split('');
const db = require('quick.db');
module.exports = class BattleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'battle',
			aliases: ['fight', 'death-battle', 'rpg-battle'],
			group: 'games-mp',
			memberName: 'battle',
			description: 'Engage in a turn-based battle against another user or the AI.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to battle? To play against AI, choose me.',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not battle yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name, data: new Battle(msg.author, opponent) });
		const battle = this.client.games.get(msg.channel.id).data;
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			while (!battle.winner) {

				const canvas = createCanvas(125, 32);
				const ctx = canvas.getContext('2d');
				const text = this.randomText(5);
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.beginPath();
				ctx.strokeStyle = '#0088cc';
				ctx.font = this.client.fonts.get('Captcha.ttf').toCanvasString(26);
				ctx.rotate(-0.05);
				ctx.strokeText(text, 15, 26);

				const choice = await battle.attacker.chooseAction(msg);
				if (choice === 'attack') {
					const damage = randomRange(battle.defender.guard ? 5 : 20, battle.defender.guard ? 20 : 50);
					await msg.say(`${battle.attacker} deals **${damage}** damage!`);
					battle.defender.dealDamage(damage);
					battle.reset();
				} else if (choice === 'defend') {
					await msg.say(`${battle.attacker} defends!`);
					battle.attacker.changeGuard();
					battle.reset(false);
				} else if (choice === 'special') {
					const miss = Math.floor(Math.random() * 5);
					if (miss === 0 || miss === 3) {
						await msg.say(`${battle.attacker}'s special attack missed!`);
					} else if (miss === 1 || miss === 5) {
						const damage = randomRange(battle.defender.guard ? 10 : 40, battle.defender.guard ? 40 : 100);
						await msg.say(`${battle.attacker}'s special attack grazed the opponent, dealing **${damage}** damage!`);
						battle.defender.dealDamage(damage);
					} else if (miss === 2) {
						const damage = randomRange(battle.defender.guard ? 20 : 80, battle.defender.guard ? 80 : 200);
						await msg.say(`${battle.attacker}'s special attack hit directly, dealing **${damage}** damage!`);
						battle.defender.dealDamage(damage);
					}
					battle.attacker.useMP(25);
					battle.reset();
				} else if (choice === 'cure') {
					const amount = Math.round(battle.attacker.mp / 2);
					await msg.say(`${battle.attacker} heals **${amount}** HP!`);
					battle.attacker.heal(amount);
					battle.attacker.useMP(battle.attacker.mp);
					battle.reset();
				} else if (choice === 'regen') {
					const regen = Math.floor(Math.random() * 50) + 1;
					await msg.reply(
						'**You have 15 seconds, Cap Sensitive!**',
						{ files: [{ attachment: canvas.toBuffer(), name: 'captcha-quiz.png' }] }
					);
					const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
						max: 1,
						time: 15000
					});
                 if (!msgs.size) {
					await msg.say(`Sorry, time is up! It was ${text}.`)
					battle.reset();
				} else if (msgs.first().content !== text) {
					await msg.say(`Nope, sorry, it's ${text}.`)
					battle.reset();
				} else if (msgs.first().content == text) {
					await msg.say(`${battle.attacker} regenerated **${regen}** MP`);
					battle.attacker.giveMP(regen);
					battle.reset(false);
                }
				} else if (choice === 'final') {
					await msg.say(`${battle.attacker} uses their final move, dealing **100** damage!`);
					battle.defender.dealDamage(100);
					battle.attacker.useMP(50);
					battle.attacker.usedFinal = true;
					battle.reset();
				} else if (choice === 'run') {
					await msg.say(`${battle.attacker} flees!`);
					battle.attacker.forfeit();
				} else if (choice === 'failed:time') {
					await msg.say(`Time's up, ${battle.attacker}!`);
					battle.reset();
					if (battle.lastTurnTimeout) {
						battle.endedDueToInactivity = true;
						break;
					} else {
						battle.lastTurnTimeout = true;
					}
				} else {
					await msg.say('I do not understand what you want to do.');
				}
				if (choice !== 'failed:time' && battle.lastTurnTimeout) battle.lastTurnTimeout = false;
			}
			this.client.games.delete(msg.channel.id);
			let loser = [];
			if (winner.id === msg.author.id) loser = opponent.id;
			if (winner.id === opponent.id) loser = msg.author.id;

			if (battle.winner === 'time') return msg.say('Game ended due to inactivity.');
			db.add(`won_${winner.id}`, 1);
			db.add(`streak_${winner.id}`, 1);
			db.add(`played_${msg.author.id}`, 1);
			db.add(`played_${opponent.id}`, 1);
			db.set(`streak_${loser}`, 0);

			return msg.say(`The match is over! Congrats, ${battle.winner}!`)
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
	randomText(len) {
		const result = [];
		for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
		return result.join('');
	}
};
