# step 1: build a static binary
FROM golang:alpine AS builder

RUN apk add --update --no-cache git

RUN git clone https://github.com/yuzutech/kroki-cli.git
WORKDIR kroki-cli
RUN git checkout v0.3.0

RUN go get -d -v

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /go/bin/kroki

# step 2: build a small image
FROM scratch

COPY --from=builder /go/bin/kroki /go/bin/kroki

ENTRYPOINT ["/go/bin/kroki"]
