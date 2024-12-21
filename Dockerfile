# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl openssl-dev

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client with specific schema path
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy only necessary files from the build stage (minimal production build)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Define the ARG for NODE_ENV, with a default value of 'production'
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=9999

# Copy Prisma schema and migrations (if needed)
COPY src/prisma/schema.prisma ./src/prisma/
COPY src/prisma/migrations ./src/prisma/migrations

# Copy base .env file first
COPY ./.env /app/.env

# Then copy environment specific .env file to overlay additional configs
COPY ./.env.${NODE_ENV} /app/.env.${NODE_ENV}

# Run the application
CMD ["npm", "run", "start:prod"]