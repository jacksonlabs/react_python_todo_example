FROM node:11

RUN mkdir /gui

ADD . /gui/

WORKDIR /gui/

EXPOSE 3000

RUN yarn install

CMD yarn start
