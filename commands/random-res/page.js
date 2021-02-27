const Command = require('../../structures/Command');
const pages = require('../../assets/json/page');

module.exports = class PageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'page',
			group: 'search',
			memberName: 'page',
			description: 'Find pages with quotes from discord members.',
			args: [
				{
					key: 'page',
					prompt: 'Which page would you like to see the quote of?',
					type: 'integer',
					min: 1,
					max: rules.length
				}
			]
		});
	}

	run(msg, { page }) {
		return msg.say(`**Page #${rule}:** ${pages[page - 1]}`);
	}
};
