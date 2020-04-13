# step 1: build a single binary
FROM node:12.16.2-alpine3.11 AS builder

# Workaround: https://github.com/nodejs/docker-node/issues/813#issuecomment-407339011
# Error: could not get uid/gid
# [ 'nobody', 0 ]
RUN npm config set unsafe-perm true

RUN npm install -g pkg pkg-fetch
ENV NODE node10
ENV PLATFORM alpine
ENV ARCH x64
RUN /usr/local/bin/pkg-fetch ${NODE} ${PLATFORM} ${ARCH}

RUN apk add --update --no-cache git

RUN git clone https://github.com/skanaar/nomnoml.git
WORKDIR nomnoml
RUN git checkout v0.6.2

RUN npm i
RUN /usr/local/bin/pkg --targets ${NODE}-${PLATFORM}-${ARCH} dist/nomnoml-cli.js -o nomnoml.bin

# step 2: build a small image
FROM alpine:3.11

COPY --from=builder /nomnoml/nomnoml.bin /node/bin/nomnoml

RUN apk add --no-cache libstdc++

ENTRYPOINT ["/node/bin/nomnoml"]
