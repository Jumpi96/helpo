FROM node:carbon-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY helpo-web/package*.json ./

# Install Python
RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    git

# If you are building your code for production
RUN npm install chalk eslint node-sass-chokidar npm-run-all react-scripts redux-devtools-extension
RUN npm install --only=production

# Delete Python
RUN apk del .gyp

# Bundle app source
COPY helpo-web/ .

# Prepare build for production
RUN npm run build

# Adding facade app
WORKDIR /usr/src/facade
COPY helpo-facade/ .
RUN npm install --only=production 
RUN npm run build

# Copy built app into nginx container
FROM nginx:alpine
COPY --from=0 /usr/src/facade/build /usr/share/nginx/html/facade
COPY --from=0 /usr/src/app/build /usr/share/nginx/html/app
RUN cp -r /usr/share/nginx/html/app/static/* /usr/share/nginx/html/facade/static
COPY helpo-web/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# This Dockerfile requires docker-ce >= 17.05
