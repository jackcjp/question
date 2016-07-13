#
# AUTHOR            Jpchen <jpchen@example.com>
# DOCKER-VERSION    1.9.1
# Copyright         (C) 2016 example Technologies Ltd. All rights reserved.
#
# Description       Dockerfile for Question Service image base on nodejs
#
FROM  edu.lxpt.cn/nodejs_ms:latest
MAINTAINER Jpchen <jpchen@example.com>
LABEL example-question-build="0.1.0-{{PIPELINE_BUILD_NUMBER}}"

# set environment variables
ENV QUESTION_VERSION="0.1.0"

# install packages
RUN apk --update add make git nodejs && \
    rm /var/cache/apk/*

# add metadate custom & runonce scripts
COPY scripts /scripts
RUN bash /scripts/setup/install
RUN rm -fr /scripts/setup

# copy code
COPY src ${APP_DIR}
