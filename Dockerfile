# ---- Base Node ----
FROM node:16 AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install --only=production
COPY . .

# ---- Build ----
FROM dependencies AS build
RUN npm run build

# ---- Release ----
FROM node:16-alpine AS release
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]