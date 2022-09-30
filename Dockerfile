FROM node:14-stretch as build

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install -g @nestjs/cli@8.1.1
RUN npm install --verbose

RUN npm run build
RUN ls -l /usr/src/app/

FROM node:14-stretch as dist

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/ecosystem.config.js ./

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
