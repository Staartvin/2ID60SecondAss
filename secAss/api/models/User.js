/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {

		name: {
			type: 'string',
			required: true,
			unique: true
		},

		email: {
			type: 'email',
			required: true,
			unique: true
		},

		password: {
			type: 'string',
			required: true
		},

		uploadedImages: {
			collection: 'image',
			via: 'author'
		},

		comments: {
			collection: 'comment',
			via: 'author'
		},

		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},
	},

	seedData: [
		{
			name: 'Vincent',
			email: 'mijnleraar@msn.com',
			password: '$2a$10$0Zi2HwJ2CshfUJPVBz5Xm.9zhI3Gvput0V1UvjhKxhiTF1/wUUd.e', //hallo12
			uploadedImages: [{
				id: 1
				}],
			comments: []
    }
  ]
};