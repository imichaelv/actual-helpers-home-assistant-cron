ARG VERSION='ABC'
FROM ghcr.io/psybers/actual-helpers
#USER root
COPY run.js /usr/src/app
RUN echo $(ls /usr/src/app)
RUN echo "Micht"
RUN echo $VERSION
RUN #chmod a+x /usr/src/app/run.sh
#USER node
ENTRYPOINT []
#CMD ["sh", "ls /usr/src/app"]
#CMD ["pwd"]

#CMD ["ls", "-ltrah"]
#CMD ["node", "apply-interest.js"]
CMD ["node", "run.js"]
