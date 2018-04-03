FROM node:4.4.3
RUN useradd -ms /bin/bash node
COPY serverfiles/ /home/node/serverfiles/
RUN chown -R node /home/node/serverfiles
RUN cd /home/node/serverfiles && npm install sqlite3@3.1.13
WORKDIR /home/node/serverfiles
USER node
ENTRYPOINT ["node","index.js"] 
