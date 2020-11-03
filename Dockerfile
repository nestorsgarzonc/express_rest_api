FROM node:12
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8080
ENV NODE_ENV="prod"
ENV MONGO_URI="<ADD MONGO URI>"
EXPOSE 8080
CMD ["npm", "start"]