/**
 * Stories.js
 *
 * @description :: User contributed stories
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: 'true',
      maxLength: 50
    },
    description: {
      type: 'string',
      required: true
    }

  }
};

