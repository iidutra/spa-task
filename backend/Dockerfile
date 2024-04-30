FROM node:20

WORKDIR /backend

# Install build tools to compile native npm modules
RUN apt-get update && apt-get install -y build-essential

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3333

CMD ["npm", "start"]
