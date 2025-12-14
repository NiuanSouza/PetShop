FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy rest of the source code
COPY . .

# Expose the application port (default Express)
EXPOSE 3000

# Default command (will be overridden by docker-compose if needed)
CMD ["pnpm", "run", "dev"]
