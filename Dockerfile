# Stage 1: Build the React app
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .env .
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_URL
# ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
# RUN REACT_APP_BACKEND_URL=$(grep -E '^REACT_APP_BACKEND_URL=' .env | cut -d '=' -f2-) && \
#    export REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-http://authserver-backend:8080} && \
#    npm run build
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL:-http://authserver-backend:8080}
RUN npm run build

# Stage 2: Serve the app
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]