/* global Variables */
var _ = require('lodash')
var defaults = {
	__DEBUG: false,
	__ENV: 'production',
	__BUILDTIME: Date.now()
}

var config = {
	development: _.defaultsDeep({
		__DEBUG: true,
		__ENV: 'development'
	}, defaults),

	production: _.defaultsDeep({
		//
	}, defaults)
}

module.exports = function(env) {
	return config[env || 'production']
}
