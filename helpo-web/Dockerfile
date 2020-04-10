FROM node:carbon-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install Python
RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    git

# If you are building your code for production
# RUN npm install --only=production
RUN npm install

# Delete Python
RUN apk del .gyp

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
