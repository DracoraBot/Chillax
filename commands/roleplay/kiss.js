const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { KISS_ALBUM_ID } = process.env;
const db = require('quick.db');
const messages = [
	"How cute!",
	"Awnnn",
	"Mwahh",
	"<3",
	"So sweet",
	":blush:",
	"cuuuttte",
	"Love Birds"
];
module.exports = class KissCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'kiss',
			aliases: ['marry'],
			group: 'roleplay',
			memberName: 'kiss',
			description: 'Kisses a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: KISS_ALBUM_ID,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	generateText(msg, user) {
		const kissSent = db.fetch(`kiss_${user.id}.sent`);
		const kissRec = db.fetch(`kiss_${user.id}.received`);
		if (kissRec === null) {
			db.set(`kiss_${user.id}.received`, 0)
		} else {
			db.add(`kiss_${user.id}.received`, 1)
		}
		if (kissSent === null) {
			db.set(`kiss_${msg.author.id}.sent`, 0)
		} else {
			db.add(`kiss_${msg.author.id}.sent`, 1)
		}
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		return `**${msg.author.username}** kisses **${user.username}**. ${randomMessage}`;
	}
};
