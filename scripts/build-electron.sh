#!/bin/bash

# Remove out directory
rm -rf packages/bruno-electron/out

# Build web app and workspace libraries
pnpm build:web

# Remove web directory
rm -rf packages/bruno-electron/web

# Create a new web directory
mkdir packages/bruno-electron/web

# Copy build
cp -r packages/bruno-app/dist/* packages/bruno-electron/web


# Update static paths
sed -i'' -e 's@/static/@static/@g' packages/bruno-electron/web/**.html
sed -i'' -e 's@/static/font@../../static/font@g' packages/bruno-electron/web/static/css/**.**.css

# Remove sourcemaps
find packages/bruno-electron/web -name '*.map' -type f -delete

node ./scripts/materialize-electron-runtime-deps.mjs

if [ "$1" == "snap" ]; then
  echo "Building snap distribution"
  pnpm --filter pulse dist:snap
elif [ "$1" == "mac" ]; then
  echo "Building mac distribution"
  pnpm --filter pulse dist:mac
elif [ "$1" == "win" ]; then
  echo "Building windows distribution"
  pnpm --filter pulse dist:win
elif [ "$1" == "deb" ]; then
  echo "Building debian distribution"
  pnpm --filter pulse dist:deb
elif [ "$1" == "rpm" ]; then
  echo "Building rpm distribution"
  pnpm --filter pulse dist:rpm
elif [ "$1" == "linux" ]; then
  echo "Building linux distribution"
  pnpm --filter pulse dist:linux
else
  echo "Please pass a build distribution type"
fi
