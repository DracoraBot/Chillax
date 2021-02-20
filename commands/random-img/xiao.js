const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { CHILLAX_ALBUM_ID } = process.env;

module.exports = class ChillaxCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'chillax',
			aliases: ['chillax-pai', 'iao'],
			group: 'random-img',
			memberName: 'chillax',
			description: 'Responds with a random image of Chillax Pai.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: CHILLAX_ALBUM_ID,
			credit: [
				{
					name: 'Marvelous',
					url: 'http://www.marv.jp/',
					reasonURL: 'http://www.runefactory4.com/index1.html',
					reason: 'Images, Original "Rune Factory 4" Game'
				}
			]
		});
	}

	generateText() {
		return 'It\'s me, yes?';
	}
};
