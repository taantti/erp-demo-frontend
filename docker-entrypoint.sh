#!/bin/sh
set -e

# Replace the build-time placeholder with the real backend URL provided at
# runtime (e.g. `docker run -e VITE_API_URL=https://api.example.com`).
# Default to localhost:8000 if none is given.
: "${VITE_API_URL:=http://localhost:8000}"

find /usr/share/nginx/html/assets -type f -name "*.js" \
  -exec sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" {} +

echo "Injected VITE_API_URL=${VITE_API_URL} into built assets"
