FROM node:11

RUN yarn global add serve

RUN mkdir /code

ADD . /code/

WORKDIR /code/

RUN yarn cache clean && yarn build

CMD serve -s build

EXPOSE 5000
