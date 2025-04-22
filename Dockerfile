# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install dependencies for Puppeteer
RUN apk update && \
    apk add --no-cache \
      ca-certificates \
      freetype \
      harfbuzz \
      nss \
      ttf-freefont \
      fontconfig \
      nodejs \
      yarn \
      libx11 \
      libxcomposite \
      libxdamage \
      libxi \
      libxtst \
      libxrandr \
      alsa-lib \
      pango \
      libc6-compat \
      chromium

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies for Puppeteer
RUN apk update && \
    apk add --no-cache \
      ca-certificates \
      freetype \
      harfbuzz \
      nss \
      ttf-freefont \
      fontconfig \
      libx11 \
      libxcomposite \
      libxdamage \
      libxi \
      libxtst \
      libxrandr \
      alsa-lib \
      pango \
      chromium

# Create user and group before setting permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create cache directory for Puppeteer and set permissions
RUN mkdir -p /home/nextjs/.cache/puppeteer && \
    chown -R nextjs:nodejs /home/nextjs/.cache

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Puppeteer environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_CACHE_DIR=/home/nextjs/.cache/puppeteer
ENV PUPPETEER_ARGS='--no-sandbox --disable-setuid-sandbox'

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]