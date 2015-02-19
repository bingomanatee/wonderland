/**
 * StoryPages.js
 *
 * @description :: This is a page in a story.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    order: {
      type: 'int'
    },

    fromPage: {
      model: 'storypages'
    },

    toPageCode: {
      type: 'string'
    },

    prompt: {
      type: 'text'
    },

    story: {
      model: 'stories'
    },

    reversible: {
      type: 'boolean'
    },

    reversePrompt: {
      type: 'text'
    }
  }
};

