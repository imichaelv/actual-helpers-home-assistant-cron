FROM ghcr.io/psybers/actual-helpers

COPY run.sh /
RUN chmod a+x /run.sh

CMD ["/run.sh"]