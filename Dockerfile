FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# for transpile the typescript files
RUN npm install -g typescript

# just install the production dependencies
RUN npm install --omit=dev

COPY . .

# force ts transpiling to js, dont check type errors, just transpile
RUN tsc --noEmit false --allowJs true --checkJs false --noImplicitAny false --skipLibCheck true

ENV NODE_ENV=production
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_NAME=${DB_NAME}

EXPOSE ${PORT}

CMD ["node", "dist/server.js"]
