FROM node:latest
RUN npm install -g jsdoc protobufjs browserify grunt uglify && echo | pbjs - > /dev/null
ENV NODE_PATH=/usr/local/lib/node_modules
WORKDIR /sleep-diary-toolkit
CMD ["make"]