ARG BUILD_FROM
FROM ghcr.io/psybers/actual-helpers AS helpers
FROM $BUILD_FROM as HA_BASE

WORKDIR /usr/src/app
COPY --from=helpers /usr/src/app /usr/src/app

RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    make \
    g++ \
    python3 \
    sqlite-dev

RUN npm install && npm update
RUN npm install luxon
RUN npm rebuild better-sqlite3

COPY run.js /usr/src/app/run.js
COPY custom_scripts/apply-annuity.js /usr/src/app/apply-annuity.js

ENTRYPOINT []
USER root
CMD ["node", "run.js"]
