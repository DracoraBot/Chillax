const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const choices = ['attack', 'defend', 'special', 'cure', 'final', 'regen', 'run'];

module.exports = class Battler {
	constructor(battle, user) {
		this.battle = battle;
		this.user = user;
		this.bot = user.bot;
		this.hp = 500;
		this.mp = 500;
		this.guard = false;
		this.usedFinal = false;
	}

	async chooseAction(msg) {
		if (this.bot) {
			if (this.canFinal) return 'final';
			const botChoices = ['attack', 'attack', 'defend'];
			if (this.canSpecial) botChoices.push('special');
			if (this.canHeal && this.hp < 200) botChoices.push('cure');
			return botChoices[Math.floor(Math.random() * botChoices.length)];
		}
		// Setup stats viewer
		const repeat = {
			hp: this.battle.user.hp / 10,
			mp: this.battle.user.mp / 10,
			ehp: this.battle.opponent.hp / 10,
			emp: this.battle.opponent.mp / 10
		}
		let content = stripIndents`
			> It is [ ${this} ]'s turn!
			\`\`\`
			Moves: ${list(choices.map(choice => `${choice}`), 'or')}?
			${this.battle.user.user.tag}:
			HP: [${'█'.repeat(repeat.hp)}${' '.repeat(50 - repeat.hp)}] (${this.battle.user.hp})
			MP: [${'█'.repeat(repeat.mp)}${' '.repeat(50 - repeat.mp)}] (${this.battle.user.mp})
			${this.battle.opponent.user.tag}:
			HP: [${'█'.repeat(repeat.ehp)}${' '.repeat(50 - repeat.ehp)}] (${this.battle.opponent.hp})
		 	MP: [${'█'.repeat(repeat.emp)}${' '.repeat(50 - repeat.emp)}] (${this.battle.opponent.mp})\`\`\`
		`;
		if (this.battle.turn === 1 || this.battle.turn === 2) {
			content += '\n\n_Special uses 25 MP whether or not it hits. Cure takes remaining MP and heals half that amount._';
			content += '\n_To use Final, you must have under 100 HP and over 50 MP. Final can only be used once!_';
			content += '\n_Regen sends you a captcha to gain 1-50 MP._';
			content += '\n_Battles may take up to 10 minutes._';

		}
		await msg.say(content);
		const filter = res => {
			const choice = res.content.toLowerCase();
			if (res.author.id === this.user.id && choices.includes(choice)) {
				if ((choice === 'special' && !this.canSpecial) || (choice === 'cure' && !this.canHeal)) {
					msg.say('You don\'t have enough MP for that!').catch(() => null);
					return false;
				}
				if (choice === 'regen' && !this.canRegen) {
					msg.say('You must be bellow 500 MP in order to start regenerating!').catch(() => null);
					return false;
				}
				if (choice === 'final' && !this.canFinal) {
					msg.say('You must have under 100 HP and over 50 MP. Final can only be used once!').catch(() => null);
					return false;
				}
				return true;
			}
			return false;
		};
		const turn = await msg.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!turn.size) return 'failed:time';
		return turn.first().content.toLowerCase();
	}

	dealDamage(amount) {
		this.hp -= amount;
		return this.hp;
	}

	heal(amount) {
		this.hp += amount;
		return this.hp;
	}

	giveMP(amount) {
		this.mp += amount;
		return this.mp;
	}

	useMP(amount) {
		this.mp -= amount;
		return this.mp;
	}

	changeGuard() {
		this.guard = !this.guard;
		return this.guard;
	}

	forfeit() {
		this.hp = 0;
		return null;
	}

	get canHeal() {
	return this.hp < 250 && this.mp > 0;

	}

	get canRegen() {
		return this.mp < 400;
	}

	get canSpecial() {
		return this.mp >= 25;
	}

	get canFinal() {
		return this.hp < 100 && this.mp >= 50 && !this.usedFinal;
	}

	toString() {
		return this.user.toString();
	}
};
