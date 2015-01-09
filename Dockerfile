FROM google/nodejs
MAINTAINER Christiaan Hees <christiaan@q42.nl>

WORKDIR /appsrc
COPY . /appsrc

RUN curl https://install.meteor.com/ | sh && \
    meteor build ../app --directory --architecture os.linux.x86_64 && \
    rm -rf /appsrc
# TODO rm meteor so it doesn't take space in the image?

WORKDIR /app/bundle

RUN (cd programs/server && npm install)
EXPOSE 8080
CMD []
ENV PORT 8080
ENV ROOT_URL http://104.155.7.233
ENTRYPOINT MONGO_URL=mongodb://$MONGO_SERVICE_HOST:$MONGO_SERVICE_PORT /nodejs/bin/node main.js
