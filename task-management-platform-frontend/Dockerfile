# Use Node.js 20 Alpine for a lightweight dev environment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
