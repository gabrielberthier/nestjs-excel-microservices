#
# 🧑‍💻 Development
#
FROM node:22-alpine AS dev
# Create app folder
WORKDIR /home/node

# Set to dev environment
ENV NODE_ENV dev

# Create non-root user for Docker
USER node

# Copy source code into app folder
COPY --chown=node:node . .

# Install dependencies
RUN yarn --frozen-lockfile

# Set Docker as a non-root user
USER node

EXPOSE 3000

#
# 🏡 Production Build
#
FROM node:22-alpine AS build

WORKDIR /home/node

# Set to production environment
ENV NODE_ENV production

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /home/node/node_modules ./node_modules
# Copy source code
COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN yarn --frozen-lockfile --production && yarn cache clean

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:22-alpine AS prod

WORKDIR /home/node
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
USER node

# Copy only the necessary files
COPY --chown=node:node --from=build /home/node/dist dist
COPY --chown=node:node --from=build /home/node/node_modules node_modules

# Set Docker as non-root user
USER node

CMD ["node", "dist/main.js"]
