const request = require('node-superfetch');
const { PERSPECTIVE_API_KEY } = process.env;
const { Command } = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class ToxicityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'analyze',
			aliases: ['comment-analyze'],
			group: 'analyze',
			memberName: 'analyze',
			description: 'Analyze a text to detect any kind of attributes.',
			credit: [
				{
					name: 'Perspective API',
					url: 'https://www.perspectiveapi.com/#/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to test the score of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await request
				.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
				.query({ key: PERSPECTIVE_API_KEY })
				.send({
					comment: { text },
					languages: ['en'],
					requestedAttributes: { TOXICITY: {}, SPAM: {}, INCOHERENT: {}, INSULT: {}, FLIRTATION: {}, SEVERE_TOXICITY: {}, THREAT: {}, SEXUALLY_EXPLICIT: {}, PROFANITY: {} }
				});
			const toxicity = Math.round(body.attributeScores.TOXICITY.summaryScore.value * 100);
			const spam = Math.round(body.attributeScores.SPAM.summaryScore.value * 100);
			const incoherent = Math.round(body.attributeScores.INCOHERENT.summaryScore.value * 100);
			const insult = Math.round(body.attributeScores.INSULT.summaryScore.value * 100);
			const flirtation = Math.round(body.attributeScores.FLIRTATION.summaryScore.value * 100);
			const severe_toxicity = Math.round(body.attributeScores.SEVERE_TOXICITY.summaryScore.value * 100);
			const threat = Math.round(body.attributeScores.THREAT.summaryScore.value * 100);
			const sexually_explicit = Math.round(body.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value * 100);
			const profanity = Math.round(body.attributeScores.PROFANITY.summaryScore.value * 100);


			const embed = new MessageEmbed()
				.setColor(msg.guild.me.displayHexColor)
				.setTitle('💬 | Message Analyzer | 💬')
				.setDescription(`${text}`)
				.addField('Toxicity', `${toxicity}%`, true)
				.addField('Spam', `${spam}%`, true)
				.addField('Incoherence', `${incoherent}%`, true)
				.addField('Insult', `${insult}%`, true)
				.addField('Simp', `${flirtation}%`, true)
				.addField('Severe Toxicity', `${severe_toxicity}%`, true)
				.addField('Threat', `${threat}%`, true)
				.addField('Sexually', `${sexually_explicit}%`, true)
				.addField('Profanity', `${profanity}%`, true)
				.setFooter('AI from perspective.com')
			msg.channel.send({ embed });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
