FROM node:20.18.0

RUN useradd -ms /bin/bash ts-backend
# /home/ts-backend \

WORKDIR /home/ts-backend

COPY package*.json /home/ts-backend/

RUN npm install

COPY . .

USER ts-backend

EXPOSE 5050

CMD [ "npm", "run", "dev" ]