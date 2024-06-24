FROM node:20.14-alpine3.19
WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli
RUN npm install
EXPOSE 3000
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "3000"]