FROM node:20.18.0

RUN useradd -ms /bin/bash loc
# /home/loc \

WORKDIR /home/loc

COPY package*.json /home/loc/

RUN npm install

COPY . .

RUN npx prisma generate

USER loc

EXPOSE 6060

CMD [ "npm", "run", "dev" ]