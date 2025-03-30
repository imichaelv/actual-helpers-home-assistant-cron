ARG VERSION='ABC'
FROM ghcr.io/psybers/actual-helpers
COPY run.js /usr/src/app

ENTRYPOINT []

CMD ["node", "run.js"]
