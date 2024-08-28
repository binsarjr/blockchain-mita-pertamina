#!/bin/bash

# This script is used to deploy the application to the server From YOUR computer
# If you want to deploy using CI/CD, you can use the deploy.yml file and change some variables and codes

set -e

SSH_HOST="your-server-ip-or-domain.com"
SSH_USERNAME="root"
SSH_PORT="22"
WORKING_DIR="/app"

echo "Read Environment Variables From .env.production"
source $(pwd)/.env.production

echo "Installing dependencies..."

pnpm install --frozen-lockfile

echo "Building app..."

pnpm run build

echo "Installing dependencies production..."

pnpm install --prod --frozen-lockfile

echo "Deploying app..."

SSH_TARGET="$SSH_USERNAME@$SSH_HOST:$WORKING_DIR/"

echo "Copy build files to Deployment Server"
rsync -avzrhcP --delete-after -e "ssh -p $SSH_PORT" ./build $SSH_TARGET

echo "Copy migrations files to remote server"
rsync -avzrhcP --delete-after -e "ssh -p $SSH_PORT" ./prisma $SSH_TARGET

echo "Sync node_modules to remote server"
rsync -avzrhcP --delete-after -e "ssh -p $SSH_PORT" ./node_modules $SSH_TARGET

echo "Copy config files to remote server"
rsync -avzrhcP --delete-after -e "ssh -p $SSH_PORT" \
  ./package.json \
  ./pnpm-lock.yaml \
  $SSH_TARGET

echo "Copy .env.production to remote server"
rsync -avzrhcP --delete-after -e "ssh -p $SSH_PORT" \
  ./.env.production \
  $SSH_TARGET
