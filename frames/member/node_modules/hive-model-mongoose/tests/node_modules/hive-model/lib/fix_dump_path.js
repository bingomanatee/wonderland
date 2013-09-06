var support = require('support');

module.exports = function (dump_path) {

	var dump_name = this.get_config('dump_name');
	if (!dump_name){
		dump_name = this.name;
	}
	var name_suffix = dump_name.replace(/[\s]+/g, '') + '.json';
	dump_path = support.proper_path(dump_path);
	var re = new RegExp(name_suffix + '$');
	if (!re.test(dump_path)) {
		dump_path += '/' + name_suffix;
	}
	return dump_path;
}