ARG BUILD_FROM
FROM ghcr.io/psybers/actual-helpers AS helpers
FROM $BUILD_FROM as HA_BASE

WORKDIR /usr/src/app
COPY --from=helpers /usr/src/app /usr/src/app

RUN apk add --no-cache \
    nodejs \
    npm \
    git

RUN npm install && npm update

COPY run.js /usr/src/app/run.js

ENTRYPOINT []
USER root
CMD ["node", "run.js"]
