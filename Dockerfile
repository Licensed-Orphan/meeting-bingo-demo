# Development Dockerfile for Meeting Bingo
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git (needed for some npm packages)
RUN apk add --no-cache git

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
