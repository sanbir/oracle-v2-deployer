# sorry for one-stage build and not compiling TS to JS, but I guess it's fine for our purposes
FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]