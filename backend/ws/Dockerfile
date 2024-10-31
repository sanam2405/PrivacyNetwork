FROM node:20.18.0

RUN useradd -ms /bin/bash ws
# /home/ws \

WORKDIR /home/ws

COPY package*.json /home/ws/

RUN npm install

COPY . .

USER ws

EXPOSE 8080

CMD [ "sh", "-c", "npm run build && npm start" ]
