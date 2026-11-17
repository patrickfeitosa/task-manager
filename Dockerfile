# syntax=docker/dockerfile:1
# Minimal two-stage image: build the app, then run `next start` with production dependencies only.
# The build needs internet access (next/font downloads Inter from Google Fonts).

FROM node:24-alpine AS build
WORKDIR /app
# --ignore-scripts / HUSKY=0: the `prepare` script installs git hooks, and there is no git here.
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
# `public/` is empty in this project (git does not track empty folders), so make sure it exists.
RUN mkdir -p public && yarn build

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production HUSKY=0 NEXT_TELEMETRY_DISABLED=1 PORT=3000
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile --production --ignore-scripts && yarn cache clean
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js
USER node
EXPOSE 3000
CMD ["yarn", "start"]
