var _ = require('lodash')

var mixin = function() {
	this.active = true
	this._update = function(dt, stage, time) {
		if(this.update) this.update(dt, stage, time)
		var children = this.children || []
		_.each(children, function(e, i, arr) {
			if(e._update && e.active) e._update(dt, stage, time)
		})
	}
}

module.exports = mixin
