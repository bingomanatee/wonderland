var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var schema = mongoose.Schema(require('schema.json'));

var Skills = mongoose.model('skills', schema);

module.exports = Skills;