FROM node:carbon-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Production installation needs:
# RUN npm install chalk --save
# Installing for production showed 'npm-run-all: not found'

# Bundle app source
COPY . .

# Prepare build for production
# RUN npm run build
# RUN npm install -g serve
# RUN serve -s build
# started an static (unuseful) server at :5000

EXPOSE 3000
CMD [ "npm", "start" ]
