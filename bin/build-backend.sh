#!/usr/bin/env sh

cd functions

npm ci
CI=false npm run build
