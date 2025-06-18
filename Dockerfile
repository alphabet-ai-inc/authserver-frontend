# Stage 1: Build the React app
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .env .
RUN npm install
COPY . .
ARG REACT_APP_BACKEND
# ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
RUN REACT_APP_BACKEND=$(grep -E '^REACT_APP_BACKEND=' .env | cut -d '=' -f2-) && \
    export REACT_APP_BACKEND=${REACT_APP_BACKEND:-http://authserver-backend:8080} && \
    npm run build

RUN npm run build

# Stage 2: Serve the app
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]