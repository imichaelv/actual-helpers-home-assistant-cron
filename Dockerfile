ARG BUILD_FROM
FROM ghcr.io/psybers/actual-helpers as helpers
FROM $BUILD_FROM as HA_BASE

WORKDIR /usr/src/app
COPY --from=helpers /usr/src/app /user/src/app

RUN apk add --no-cache \
    nodejs \
    npm \
    git


COPY run.js /usr/src/app/run.js

ENTRYPOINT []
USER root
CMD ["node", "run.js"]
