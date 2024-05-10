# First time setup
1. `pnpm i`
2. `git submodule update --init`
3. `npx prisma migrate`
2. `npx prisma generate`

# Continuing setup
After changing something in [./prisma/schema.prisma](./prisma/schema.prisma) `npx prisma migrate dev --name <DESCRIBE-YOUR-THING>`


# Archive (Ignore this section)
## Postgres
Start postgres:
`docker run -d -v we-hate-the-ui-postgres --name we-hate-the-ui-postgres -p 5432:5432 -e POSTGRES_DB=we_hate_the_ui -e POSTGRES_PASSWORD=postgres postgres`