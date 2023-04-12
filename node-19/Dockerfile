FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules
COPY src ./src

RUN npm install
# RUN npm ci --omit=dev

COPY . .

EXPOSE 8080
CMD [ "node", "src/index.js" ]