const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class OptionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'options',
			aliases: ['options-list'],
			group: 'util-public',
			memberName: 'options',
			description: 'Responds with a list of server options.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			__**Server Options**__
			Place the option in the appropriate channel's topic to use.

			__General Options__
			\`<chillax:disable-leave>\` Disables leave messages (System Channel).

			__Phone Options__
			\`<chillax:phone>\` Allows this channel to recieve phone calls.
			\`<chillax:phone:auto-accept>\` Automatically accepts all incoming phone calls.
			\`<chillax:phone:no-notice>\` Hides the abuse notice from phone call pick-ups.
			\`<chillax:phone:no-voicemail>\` Prevents this channel from recieving voicemails for missed calls.
			\`<chillax:phone:no-random>\` Makes the channel only able to be called directly, rather than picked randomly.
			\`<chillax:phone:block:INSERTIDHERE>\` Blocks a channel or server from contacting you via phone.
			\`<chillax:phone-book:hide>\` Hides this channel from \`phone-book\`.

			__Portal Options__
			\`<chillax:portal>\` Marks the channel as a portal channel for \`portal-send\`.
			\`<chillax:portal:hide-name>\` Hides the channel's name when the channel is chosen to recieve a portal message.
		`);
	}
};
