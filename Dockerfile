# Gunakan image Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Set port
ENV PORT=8080

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode aplikasi
COPY . .

# Expose port aplikasi
EXPOSE 8080

# Start aplikasi
CMD ["npm", "start"]
