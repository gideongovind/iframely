FROM node:12-alpine

EXPOSE 8061

COPY . /iframely

WORKDIR /iframely

ENV NODE_ENV=production

RUN apk add --no-cache git && \
    yarn add forever && \
    yarn install --frozen-lockfile --production

ENTRYPOINT [ "/iframely/docker/entrypoint.sh" ]
