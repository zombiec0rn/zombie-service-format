var env = require('jjv')()
var assign = require('object.assign')
var utils = require('./utils')
var schema = require('./schema.json')

var ZSFException = function(message, trace) {
	this.message  = message
	this.trace    = trace
	this.toString = function() {
		return this.message + '. Details in e.trace.'
	}
}

env.addSchema('zsf', schema)
env.addSchema('zsf-multiple', {
	type  : 'array',
	items : {
		'$ref' : "#/definitions/zsf"
	},
	definitions : {
		"zsf" : schema
	}
})

module.exports = {
	schema : schema,
	validate : function(config) {
		if (!(typeof config == 'object')) config = JSON.parse(config)
		var _config = (config instanceof Array) ? config : [config]
		var err = env.validate('zsf-multiple', _config)
		if (err) throw new ZSFException('Invalid config', err)
		return config
	},
	exception : ZSFException,
  random: function(num, opts) {
    opts = opts || {}
    return Array.apply(null, {length: num}).map(function(value, index){
      var c = utils.randomExampleContainer()
      assign(c, opts)
      return c
    })
  }
}
