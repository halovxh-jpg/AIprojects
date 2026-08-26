FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache unzip
COPY frequency-ai-web-app.zip .
RUN unzip -o frequency-ai-web-app.zip && rm frequency-ai-web-app.zip
CMD ["node", "ai-web-app/server.js"]
