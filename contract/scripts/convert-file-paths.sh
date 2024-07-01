#!/bin/bash

# Check if bundle-list file exists and is not empty
if [ ! -s bundles/bundle-list ]; then
  echo "No bundles to convert."
  exit 1
fi

# Convert paths and write to bundle-list-ship
while IFS= read -r BUNDLE_FILE; do
  BASENAME=$(basename "$BUNDLE_FILE")
  echo "/root/bundles/$BASENAME" >> bundles/bundle-list-ship
done < bundles/bundle-list

echo "Converted bundle paths saved to bundles/bundle-list-ship"