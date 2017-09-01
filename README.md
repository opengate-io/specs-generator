# specs-generator

Generate API specs from other sources such as CURL commands or file imports

[![Docker build](http://dockeri.co/image/opengate/specs-generator)](https://registry.hub.docker.com/u/opengate/specs-generator/)

[![Build Status](https://travis-ci.org/opengate-io/specs-generator.svg?branch=master)](https://travis-ci.org/opengate-io/specs-generator) [![Coverage Status](https://coveralls.io/repos/github/opengate-io/specs-generator/badge.svg?branch=master)](https://coveralls.io/github/opengate-io/specs-generator?branch=master)

##  Install instructions

```
git clone https://github.com/opengate-io/specs-generator.git
cd specs-generator
npm run build
npm start
```

## Start running from Docker image

```
docker run --name specs-generator -p 80:8000 opengate/specs-generator
```

## How to generate an API specification from CURL command

 1. Using Google Chrome: (More Tools/Developer Tools)
 2. Select a REST API you want to inspect on Network Tab
 3. Right click and choose (Copy/Copy as cURL)
 4. Launch specs-generator web application http://localhost:8000
 5. Paste into (File/Import from CURL) input dialog then Import