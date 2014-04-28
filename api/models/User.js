/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  identity: 'User',
	schema: true,

	attributes: {

  	firstName: {
  		type: 'string',
  		required: true
  	},
  	lastName: {
  		type: 'string',
  		required: true
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

  	rooms: {
  		collection: 'Chatroom',
  		via: 'owner'
  	},
  	allowedRooms: {
  		collection: 'Chatroom',
  		via: 'allowedUsers'
  	},
    messages: {
      collection: 'Message',
      via: 'poster'
    }
  }

};

