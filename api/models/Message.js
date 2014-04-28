/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  identity: 'Message',
	schema: true,

  attributes: {

  	message: {
  		type: 'string',
  		required: true
  	},

  	poster: {
  		model: 'User'
  	},
  	room: {
  		model: 'Chatroom'
  	}
  }
  
};

