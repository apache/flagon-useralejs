ARG BUILDPLATFORM=${BUILDPLATFORM:-amd64}
FROM --platform=${BUILDPLATFORM} node:18-bullseye-slim AS flagon-node

WORKDIR /app
RUN --mount=type=bind,target=./package.json,src=./package.json \
	--mount=type=bind,target=./package-lock.json,src=./package-lock.json \
	npm ci 
COPY ./src src/
COPY ./example example/

EXPOSE 8000

CMD ["node", "example/server.js"]
