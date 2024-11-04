#!/bin/bash
set -x
node_modules/.bin/webpack
cp -r ./dist/ ./public
firebase deploy --only hosting
