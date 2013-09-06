var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Base = require('./base');

/* ************************************
 * note = the js_model that is returned is unique
 * for every request.
 * ************************************ */

/* ******* CLOSURE ********* */

var script_template = _.template("\n<script src=\"<%= url %>\" <%= defer ? ' defer=\"defer\" ' : '' %> >\n" +
	"// requires <%= requires.join(', ') %>\n" +
	"</script>");

var script_head_template = _.template("\n\n<!-- -------- SCRIPTS FOR <%= context %> ---------- -->\n\n");
var script_foot_template = _.template("\n\n<!-- -------- END OF SCRIPTS FOR <%= context %> ---------- -->\n\n");

function merge(new_data, old_data){
	if(old_data.defer){
		new_data.defer = true;
	}

	if(!new_data.requires){
		new_data.requires = [];
	}

	if (old_data.requires){
		new_data.requires.push.call(new_data.requires, old_data.requires);
	}

	if(old_data.name){
		new_data.name = old_data.name;
	}

	return new_data;
}

function is_rendered(script){
	if (script.rendered){
		return true;
	}else	if (this.rendered_things[script.url]){
		script.rendered = true;
		return true;
	} else if(script.name){
		if(this.rendered_things[script.name]){
			script.rendered = true;
			return true;
		}
	}
	return false;
}

function find(query){
	return _.filter(this.items, function(item){
		if (query.url && (item.url != query.url)){
			return false;
		}
		if (query.context && (item.context != query.context)){
			return false;
		}

		if (query.name && (item.name != query.name)){
			return false;
		}

		return true;
	})
}

function render(context){
	var scripts = this.find({context: context});
	//@TODO: order by requirements
	var out = script_head_template({context: context});
	scripts.forEach(function(script){
		if (!this.is_rendered(script)) {
			out += script_template(script);
			script.rendered = true;
		}
	}, this);
	out += script_foot_template({context:context });
	return out;
}

/* ********* EXPORTS ******** */

module.exports = function (apiary) {
	var alias_model = apiary.model('js_path_alias');

	var model = new Base();
	model.rendered_things = {};

	model.find = find;
	model.is_rendered = is_rendered;
	model.merge = merge;

	model.on('add', function(script){
		if(!script.defer){
			script.defer = false;
		}
		if (!script.requires){
			script.requires = [];
		}
		var alias = alias_model.match(script.url);
		if (alias){
			_.extend(script, alias);
		}
	});

	model.render = render;

	return model;
}; // end export function