# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma directory
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Set Node.js to run in production mode
ENV NODE_ENV=production

# POSTGRES
ENV POSTGRES_USER=prisma
ENV POSTGRES_PASSWORD=topsecret
ENV POSTGRES_DB=blog

# Nest run locally
ENV DB_HOST=localhost
# Nest run in docker, change host to database container name
# DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_SCHEMA=blog

# Prisma database connection
ENV DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer

# Nest
ENV PORT=3000

# Security
ENV JWT_ACCESS_SECRET=nestjsPrismaAccessSecret
ENV JWT_REFRESH_SECRET=nestjsPrismaRefreshSecret


# Run the application
CMD ["npm", "run", "start:prod"]