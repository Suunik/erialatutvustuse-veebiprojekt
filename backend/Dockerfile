FROM golang:1.23.0-alpine AS builder

# Move to working directory (/build).
WORKDIR /build

ENV CGO_ENABLED=1
ENV CGO_CFLAGS="-D_LARGEFILE64_SOURCE"
RUN apk add --no-cache \
    # Important: required for go-sqlite3
    gcc \
    # Required for Alpine
    musl-dev

# Copy and download dependency using go mod.
COPY go.mod go.sum ./
RUN go mod download

# Copy the code into the container.
COPY . .


# Set necessary environmet variables needed for our image and build the API server.
RUN go build -ldflags="-s -w -extldflags "-static"" -o apiserver .

# Use alpine as the base image instead of scratch to include required runtime libraries
FROM alpine:latest

# Copy binary and config files from /build to root folder of alpine container.
COPY --from=builder ["/build/apiserver", "/apiserver"]
#COPY migrations /migrations

ARG PORT
ENV PORT=${PORT}

# Add a health check to ensure the database is ready before starting the server
HEALTHCHECK CMD nc -z localhost 5432 || exit 1

# Command to run when starting the container.
ENTRYPOINT ["/apiserver"]