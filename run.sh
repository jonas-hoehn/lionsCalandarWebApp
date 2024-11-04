#!/bin/bash
set -x
node_modules/.bin/webpack
cp -r ./dist/ ./public
firebase emulators:start
