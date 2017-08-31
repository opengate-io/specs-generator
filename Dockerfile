FROM node:8.4-alpine
MAINTAINER DUONG Dinh Cuong <cuong3ihut@gmail.com>

ENV TAG_VERSION 0.0.0

RUN apk --update add wget && wget --no-check-certificate https://github.com/opengate-io/specs-generator/releases/download/${TAG_VERSION}/specs-generator-${TAG_VERSION}.tgz \
    && npm install --prefix /opt specs-generator-${TAG_VERSION}.tgz \
    && ls -la /opt/node_modules \
    && ls -la /opt/node_modules/specs-generator \
    && rm -rf /var/lib/apt/lists/* \
    rm -rf /var/cache/apk/*

WORKDIR "/opt/node_modules/specs-generator/"

EXPOSE 8000

CMD ["npm","start"]
