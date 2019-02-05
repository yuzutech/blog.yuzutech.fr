# step 1: build a static binary
FROM ubuntu:18.04 AS builder

RUN apt-get update && apt-get install -y graphviz curl git

RUN curl -sSL https://get.haskellstack.org/ | sh

RUN git clone https://github.com/BurntSushi/erd.git

WORKDIR erd

RUN git checkout v0.2.0.0

RUN /usr/local/bin/stack install --ghc-options="-fPIC" \
  --ghc-options="-static" \
  --ghc-options="-optl=-static" \
  --ghc-options="-optc=-static"

# step 2: build a small image
FROM scratch

COPY --from=builder /root/.local/bin/erd /haskell/bin/erd

ENTRYPOINT ["/haskell/bin/erd"]
