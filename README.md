# specs-generator

Generate API specs from other sources such as CURL commands or file imports

[![Docker build](http://dockeri.co/image/opengate/specs-generator)](https://registry.hub.docker.com/u/opengate/specs-generator/)

[![Build Status](https://travis-ci.org/opengate-io/specs-generator.svg?branch=master)](https://travis-ci.org/opengate-io/specs-generator) [![Coverage Status](https://coveralls.io/repos/github/opengate-io/specs-generator/badge.svg?branch=master)](https://coveralls.io/github/opengate-io/specs-generator?branch=master)

Build from source code

```
npm run build
```

Start node application

```
npm start
```

Using docker image

```
docker run --name specs-generator -p 80:8000 opengate/specs-generator
```