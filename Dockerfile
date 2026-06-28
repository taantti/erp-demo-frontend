# ---- Stage 1: build the static assets ----
FROM node:20 AS build
WORKDIR /app

# Install deps in their own cached layer
COPY package*.json ./
RUN npm ci

# Build the app. VITE_API_URL is baked in at build time, so we bake a PLACEHOLDER
# and replace it with the real URL when the container starts (see docker-entrypoint.sh).
COPY . .
ENV VITE_API_URL=__VITE_API_URL__
RUN npm run build

# ---- Stage 2: serve with nginx ----
FROM nginx:alpine

# SPA routing (fall back to index.html so react-router deep links work)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Built static files
COPY --from=build /app/dist /usr/share/nginx/html

# The official nginx image runs every script in /docker-entrypoint.d/ before
# starting nginx. This one injects the runtime API URL into the built JS.
COPY docker-entrypoint.sh /docker-entrypoint.d/40-inject-api-url.sh
RUN chmod +x /docker-entrypoint.d/40-inject-api-url.sh

EXPOSE 80
# No custom CMD: the nginx image's own entrypoint runs the .d scripts, then nginx.
