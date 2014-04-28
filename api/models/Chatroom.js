/**
* Chatroom.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  identity: 'Chatroom',
	schema: true,

  attributes: {

  	name: {
  		type: 'string',
  		required: true
  	},
  	headline: {
  		type: 'string'
  	},

  	owner: {
  		model: 'User'
  	},
  	allowedUsers: {
  		collection: 'User',
  		via: 'allowedRooms',
  		dominant: true
  	},
    messages: {
      collection: 'Message',
      via: 'room'
    }
  }
  
};

