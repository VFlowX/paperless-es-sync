FROM node:alpine3.16
RUN mkdir /app
WORKDIR /app
COPY package.json tsconfig.json ./
# RUN npm install
COPY ./node_modules ./node_modules
COPY ./src ./src

# CMD npm run start
CMD npm run dev