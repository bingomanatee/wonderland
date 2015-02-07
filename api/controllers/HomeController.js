/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var util = require('util');

module.exports = {

  /**
   * `HomeController.main()`
   */
  main: function (req, res) {
    util.log('HomeController.main()');
    return res.view('home');
  }
};

