FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache unzip
COPY frequency-ai-web-app.zip .
RUN unzip -o frequency-ai-web-app.zip && rm frequency-ai-web-app.zip
COPY ai-web-app/ai.js ai-web-app/ai.js
CMD ["node", "ai-web-app/server.js"]
