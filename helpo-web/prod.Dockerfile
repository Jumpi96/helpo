FROM node:carbon-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm install --only=production

# Bundle app source
COPY . .

# Prepare build for production
RUN npm run build

# Copy built app into nginx container
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

# This Dockerfile requires docker-ce >= 17.05