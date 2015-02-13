/**
* StoryPages.js
*
* @description :: This is a page in a story.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title : { type: 'string' },

    body : { type: 'string' },

    story: {
      model: 'stories'
    }
  }
};

