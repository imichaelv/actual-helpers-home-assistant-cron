ARG VERSION='ABC'
FROM ghcr.io/psybers/actual-helpers
COPY run.js /usr/src/app

ENTRYPOINT []
USER root
CMD ["node", "run.js"]
