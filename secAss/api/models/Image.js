/**
 * Image.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		title: {
			type: 'string',
			required: true
		},

		description: {
			type: 'string',
			required: true,
			defaultsTo: 'empty'
		},

		author: {
			required: true,
			model: 'user'
		},

		comments: {
			collection: 'comment',
			via: 'commentedOn'
		},

		url: {
			type: 'string',
			required: true,
			defaultsTo: 'http://www.jennybeaumont.com/wp-content/uploads/2015/03/placeholder.gif'
		},

		favoritedBy: {
			collection: 'favoritedimage',
			via: 'image'
		}
	},

	seedData: [
		{
			title: 'My magnificent photo',
			description: 'When I was on a beach in Greece.',
			author: {
				id: 2
			},
			comments: [{
				id: 1
			}],
			url: 'http://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/France/Nice/Nice-nightlife-coastline-xlarge.jpg'
    }
  ]
};