#!/bin/bash
# Explode the content of an .js bundle into a directory.
# NB: Overwrites the existing directory.
#
# Usage: explode-bundle.sh <bundle.js>

JS_PATH=$1
# verify that the file exists
if [ ! -f "$JS_PATH" ]; then
    echo "File not found: $JS_PATH"
    exit 1
fi
JSON_PATH="$1on"
BUNDLE_NAME=$(basename "$JS_PATH" .js)
DIR=$(dirname "$JS_PATH")

echo "Exploding $BUNDLE_NAME in $DIR"

sed -n 's/^export default \(.*\);$/\1/p' "$JS_PATH" | jq '.' >"$JSON_PATH"

EXPLODED="$DIR/$BUNDLE_NAME"
rm -rf "$EXPLODED"
mkdir "$EXPLODED"
jq -r .endoZipBase64 <"$JSON_PATH" | base64 -d | tar xC "$EXPLODED"
find "$EXPLODED" -type f -exec du -h {} + | sort -hr >"$EXPLODED"/files.txt
open "$EXPLODED"/files.txt
