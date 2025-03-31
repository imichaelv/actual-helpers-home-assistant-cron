ARG BUILD_FROM
FROM ghcr.io/psybers/actual-helpers as helpers
FROM $BUILD_FROM as HA_BASE

COPY --from=helpers /usr/src/app /user/src/app
WORKDIR /usr/src/app
RUN apk add --no-cache \
    nodejs \
    npm \
    git


COPY run.js /usr/src/app

ENTRYPOINT []
USER root
CMD ["node", "run.js"]
