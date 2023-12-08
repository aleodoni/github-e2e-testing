#################### BASE
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

#################### BUILDER
FROM base AS builder
WORKDIR /app

COPY . .
RUN turbo prune --scope="@cmc/api-gateway" --docker

#################### INSTALLER
FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

#################### PRODUCTION
FROM base AS production
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile --production

#################### SOURCER
FROM base AS sourcer  
WORKDIR /app

COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN turbo run build --filter=api-gateway... --include-dependencies --no-deps

# #################### RUNNNER
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3333
ENV KAFKAJS_NO_PARTITIONER_WARNING=1
ENV KAFKA_BROKERS="kafka:9092"
ENV KAFKA_REPORT_GROUP_ID="voting:report-consumer"
ENV KAFKA_VOTING_GROUP_ID="voting:voting-consumer"
ENV KEYCLOAK_CERTIFICATE="MIICqTCCAZECBgGHdcIUazANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1rZXljbG9hay10ZXN0MB4XDTIzMDQxMjEzNTYwNloXDTMzMDQxMjEzNTc0NlowGDEWMBQGA1UEAwwNa2V5Y2xvYWstdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPQFS1d17Ec1xnplImUwgDXKiZ7G+4nNr9zvDZHI50bedxREVs4uDAtmhyOmwvg0k3oA66UV5yd/IaOjsmiYZkWpoQLTUlD6+hnU+nsm3NgBYun1HlyvPwznpan0nBJJ+ij5kgjQaP8cft1wS5H8+214fgINu/FP3JMmX6DpUPVS4Mb5anKJYdUvXWkXgS2MkwNPs3zk6nDWx8Tsfl4o/HGSflsTTasl4sXtPLr0pos70RbHd4Fg9kBH7fwjrO+1pD4ZFIMhGhgyxQwZPyAE8oiOH+9aznzI/CTp7T/OqG4hAmTQ3nPweg4YTExcIJbcFLgP3kAPYwUM+jfYqjlAIpECAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAOoDOaMmuM16zeU7Iv4NMqjQsTjXfwBDiV4jbPtEt/RppQ1m+oW2Rbh95AbPNBHxLz3iTbpud/Rd2wNNqiRV8tDE73zB+ad0GfShEFPQXJ8C8hlLjKd4vMv1hLSBInyBcWmRAwrUhKsQZmqhXDoT/D2+9D2VaAG0dFTUX2o5zO5MRX5Cb7nui+Uon41kmK9z8yMcOrEerCju4JVqep04zrLp1chm04v5uNp8q7Tlzq0w8oyMsBlaMsvtBEOqKZBPsaRuOZEqvSPjAioLN4DWDMtF1oJFumBPnGCK3rVLW7hmrek9ebHPRz4YCRDENqjMF6OLWTRJBw9vsG9CBMQR/sQ=="

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=production /app/node_modules ./node_modules
COPY --from=production /app/package.json .
COPY --from=production /app/yarn.lock .

COPY --from=sourcer /app/apps/ ./apps
COPY --from=sourcer /app/packages/ ./packages

CMD ["node", "apps/api-gateway/dist/main.js"]
