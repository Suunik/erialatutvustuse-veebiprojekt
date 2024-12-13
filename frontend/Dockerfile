FROM node:20.10-alpine AS base

# Move to working directory (/app).
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.ts .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .

CMD ["npm", "run", "dev"]