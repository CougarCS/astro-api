#!/bin/sh

set -eux

rm -rf node_modules
npm install --production

rm -rf lambda.zip

rm -rf node_modules/prisma
rm -rf node_modules/@prisma/engines
rm -rf node_modules/typescript
# TODO Delete debian engine file before zipping

zip -r lambda.zip .env package.json dist/ prisma/schema.prisma node_modules/.prisma node_modules/**

du -b ./lambda.zip