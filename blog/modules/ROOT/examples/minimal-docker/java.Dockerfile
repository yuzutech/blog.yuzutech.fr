# based on alpine 3.11
FROM adoptopenjdk/openjdk11:jre-11.0.6_10-alpine

EXPOSE 8000

COPY target/kroki-server.jar .

ENTRYPOINT exec java -jar kroki-server.jar
