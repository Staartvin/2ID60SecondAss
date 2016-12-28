/**
 * FavoritedImages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {

		user: {
			required: true,
			type: 'integer',
			model: 'user'
		},

		image: {
			required: true,
			type: 'integer',
			model: 'image'
		},


	},

	seedData: [
		{
			userID: 2,
			imageID: 1,
    },
		{
			userID: 3,
			imageID: 1,
    },
		{
			userID: 3,
			imageID: 2,
    }
  ]
};