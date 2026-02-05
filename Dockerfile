FROM node:22.19-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Instalacja bibliotek systemowych
RUN apk add --no-cache openssl libc6-compat

# Aktywacja pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

COPY package.json pnpm-lock.yaml* ./

# Ustawienie node-linker na hoisted (dla pnpm v10 + Prisma)
RUN echo "node-linker=hoisted" > .npmrc

# Instalacja zależności
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false

COPY . .



# --- FIX: Dodajemy atrapę DATABASE_URL dla procesu budowania ---
    # Next.js potrzebuje tej zmiennej, żeby nie wyrzucić błędu walidacji przy starcie.
    # Wartość nie musi być prawdziwa, byle była poprawnym URL-em.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
    
    # Budowanie aplikacji
    # Generowanie klienta Prismy
RUN pnpm prisma generate
RUN pnpm build

# --- Faza Runner ---
FROM node:22.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts


EXPOSE 3000

# Tutaj, przy uruchamianiu, aplikacja weźmie już prawdziwy DATABASE_URL z docker-compose
CMD ["sh", "-c", "echo DATABASE_URL=$DATABASE_URL && pnpm prisma migrate deploy && node server.js"]

