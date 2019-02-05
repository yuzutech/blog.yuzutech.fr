# step 1: build a static binary
FROM ekidd/rust-musl-builder:stable AS builder

RUN cargo install --version 0.4.2 svgbob_cli

# step 2: build a small image
FROM scratch

COPY --from=builder /home/rust/.cargo/bin/svgbob /rust/bin/svgbob

ENTRYPOINT ["/rust/bin/svgbob"]
