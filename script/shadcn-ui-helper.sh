#!/usr/bin/env bash
set -e

#
# See this src/renderer/README.md for how to use this script.
#
function tweak-paths() {
  sed -i .1 -e 's#config": "./#config": "./src/renderer/#; s#css": "./#css": "./src/renderer/#' components.json
  sed -i .1 -e 's#content: \["./src/renderer/#content: \["./#' src/renderer/tailwind.config.ts 
} 

$*

