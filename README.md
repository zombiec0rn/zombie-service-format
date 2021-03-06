# Zombie Service Format

Zombie Service Format (zsf) is the configuration format for [zombie services]().

The format describes services and their properties. The main purpose of this module is to provide tools and a validation schema for working with zombie services. It includes a JSON schema validator for the format. 

The format is extensible so other modules can expand it's capabilities and semantics.

## Install

```sh
npm install --save @zombiec0rn/zombie-service-format
```

## Use

```js
var zsf = require('@zombiec0rn/zombie-service-format')

try {
  zsf.validate(services)
} catch(e) {
  console.log(e instanceof zsf.exception, e.trace)
}
```

## API

#### `validate(services)`

The main usecase for this module is to validate service configs. See usage example [above](#use). 

#### `random(num, opts)`

Generate random service configs. Useful for testing etc.

```js
var zsf = require('@zombiec0rn/zombie-service-format')
var services = zsf.random(5, { host: { hostname: 'yolo' }})
```

#### `schema`

The zsf json schema.

#### `exception`

The zsf exception throws if bad config.

## Format

    {
        "id"      : "app",                 // Service id
        "image"   : "megacorp/webapp",     // Image path
        "cmd"     : "python server.py",    // Command to run        (optional)
        "ports"   : ["80:80","53:53/udp"], // List of port mappings (optional)
        "env"     : ["FOO=BAR"],           // Environment variables (optional)
        "volumes" : ["/tmp:/tmp"],         // Service volumes       (optional)
    }

### Id

The id, **app** in the example, is the service identifier. It can be any arbitrary string. No spaces.

### Image

The image, **megacorp/webapp** in the example, is URI to the service image. It can be any valid URI, relative or full.

### Cmd

The cmd, **python server.py** in the example, is the command to execute when running the service. It can be an arbitrary string.

### Ports

The ports, **["80:80"]** in the example, is a list of port mappings. A port mapping is defined using a string with two ports separated by a colon: **"host-port:service-port"** where ***host-port*** references a port on the host running the service, and the ***service-port*** references a port inside the running service. Zsf also support specifying the protocol; **["53:53/udp"]**. The two supported protocols are *tcp* and *udp*. 

### Env

The env, **["FOO=BAR"]** in the example, is a list of environment variables. An evironment variable is defined using a string with a key and a value separated by a equals sign: **"key=value"**.

### Volumes

The volumes, **["/tmp:/tmp"]** in the example, is a list of volumes to mount inside the service. There are two different ways to specify a volume:

    "/host/path:/service/path"  // Mounts a specified path on the host to the specified path in the service
    "/host/path"                // Mounts a specified path on the host to the same path in the service


## Changelog

### 1.0.0

* Initial release :tada:
