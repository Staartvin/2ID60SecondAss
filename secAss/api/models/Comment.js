/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {

		description: {
			type: 'string',
			required: true,
			defaultsTo: 'empty'
		},

		author: {
			required: true,
			model: 'user'
		},

		commentedOn: {
			model: 'image'
		}
	},

	seedData: [
		{
			description: 'I really like this photo',
			author: {
				id: 4
			},
			commentedOn: {
				id: 1
			},
    }
  ]
};