FROM node:16-alpine

WORKDIR /home/app/

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
