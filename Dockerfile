# Use an official Node.js runtime as a parent image
FROM node:22-bookworm-slim AS base

# Enable Corepack, which includes pnpm
RUN corepack enable

# Set the working directory
WORKDIR /app

# Copy package.json, pnpm-lock.yaml, and .npmrc (if you have one)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN #pnpm run build

CMD ["pnpm", "dev"]

# Use a minimal base image for the final stage
#FROM node:22-bookworm-slim AS runtime
#
## Enable Corepack
#RUN corepack enable
#
## Set the working directory
#WORKDIR /app
#
## Copy only the necessary files from the build stage
#COPY --from=base /app/package.json ./
#COPY --from=base /app/pnpm-lock.yaml ./
#COPY --from=base /app/.next ./.next
#COPY --from=base /app/public ./public
#COPY --from=base /app/node_modules ./node_modules
#
## Expose the port the app runs on
#EXPOSE 5000
#RUN npx next telemetry disable
## Start the Next.js application
#CMD ["pnpm", "start"]

