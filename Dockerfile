# Production Dockerfile for Crochet by Prisha
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy project files
COPY . .

# Expose port (Render injects PORT env variable automatically)
EXPOSE 3000 10000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
