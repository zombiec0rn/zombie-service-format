var assert   = require('assert')
var clone    = require('clone')
var zsf      = require('../index')

var config   = zsf.random(1) 
var multiple = zsf.random(2) 

describe('Zombie Service Format', function() {

	it('can validate a valid javascript object', function() {
		assert(zsf.validate(config) == config)
	})

	it('can validate a valid json string', function() {
		assert(typeof zsf.validate(JSON.stringify(config)) == 'object')
	})

	it('can validate multiple', function() {
		assert(zsf.validate(multiple) == multiple)
		assert(typeof zsf.validate(JSON.stringify(multiple)) == 'object')
	})

	it('will not validate ids with invalid chars', function() {
		var _config = clone(config)
		_config.id  = "yo lo"
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
		_config.id  = "☃"
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
	})

	it('will not validate cmd as anything but a string', function() {
		var _config = clone(config)
		_config.cmd = 2
		try { zsf.validate(_config) } catch(e) { 
			assert(e instanceof zsf.exception) 
			assert(e.trace.validation[0].schema.cmd.type == 'string')
		}
	})

	it('will not validate ports as anything but an array', function() {
		var _config   = clone(config)
		_config.ports = false
		try { zsf.validate(_config) } catch(e) {
			assert(e instanceof zsf.exception) 
			assert(e.trace.validation[0].schema.ports.type == 'array')
		}
	})

	it('will not validate badly formatted portmappings', function() {
		var _config   = clone(config)
		_config.ports = ["80:meh"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
	})

	it('will not validate env as anything but an array', function() {
		var _config   = clone(config)
		_config.env   = 2
		try { zsf.validate(_config) } catch(e) {
			assert(e instanceof zsf.exception) 
			assert(e.trace.validation[0].schema.env.type == 'array')
		}
	})

	it('will not validate badly formatted envs', function() {
		var _config   = clone(config)
		_config.env   = ["FOO:BAR"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
	})

    it('will validate numbers and dots in env', function() {
        var _config = clone(config)
        _config.env = ["FOO=192.168.1.2"]
        try { zsf.validate(_config) } catch(e) { assert(false) }
        assert(true)
    })

	it('will not validate volumes as anything but an array', function() {
		var _config     = clone(config)
		_config.volumes = 2
		try { zsf.validate(_config) } catch(e) {
			assert(e instanceof zsf.exception) 
			assert(e.trace.validation[0].schema.volumes.type == 'array')
		}
	})

	it('will not validate badly formatted volumes', function() {
		var _config     = clone(config)
		_config.volumes = ["chili"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
		_config.volumes = ["tmp:tmp"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
		_config.volumes = ["./tmp:/tmp"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
	})

	it('will not validate expose as anything but an array', function() {
		var _config     = clone(config)
		_config.expose  = 2
		try { zsf.validate(_config) } catch(e) {
			assert(e instanceof zsf.exception) 
			assert(e.trace.validation[0].schema.expose.type == 'array')
		}
	})

	it('will not validate badly formatted expose', function() {
		var _config    = clone(config)
		_config.expose = ["FOO"]
		try { zsf.validate(_config) } catch(e) { assert(e instanceof zsf.exception) }
	})

	it('will validate port/tcp and port/udp', function() {
		var _config   = clone(config)
		_config.ports = ["53:53/tcp","53:53/udp"]
		try { zsf.validate(_config) } catch(e) { assert(false) }
        assert(true)
	})

	it('uses the same schema for mulitple', function() {
		var _multiple       = clone(multiple)
		_multiple[0].expose = ["FOO"]
		try { zsf.validate(_multiple) } catch(e) { assert(e instanceof zsf.exception) }
	})

  it('can generate random test containers', function() {
    var containers = zsf.random(5, { host: { hostname: 'yolo-1' } })
    assert(containers instanceof Array)
    assert(containers.length == 5)
    containers.forEach(function(c) {
      assert(c.host.hostname == 'yolo-1')
    })
  })

})
