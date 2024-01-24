FROM node:20-alpine as builder

ARG BASE_URL $BASE_URL

WORKDIR /home/app/

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN BASE_URL=$BASE_URL yarn generate


FROM nginx:alpine

RUN mkdir -p /home/app
WORKDIR /home/app

COPY --from=builder /home/app/dist .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
