#!/bin/bash

# Check if bundle-list file exists and is not empty
if [ ! -s bundles/bundle-list ]; then
  echo "No bundles to copy."
  exit 1
fi

# Destination directory in the container
CONTAINER_DIR="/root/bundles"

# Kubernetes pod and container name
POD_NAME="default/agoriclocal-genesis-0"
CONTAINER_NAME="validator"

# Read each bundle file path from bundle-list and copy to the container
while IFS= read -r BUNDLE_FILE; do
  echo "Copying $BUNDLE_FILE to $POD_NAME:$CONTAINER_DIR"
  kubectl cp "$BUNDLE_FILE" "$POD_NAME:$CONTAINER_DIR" -c "$CONTAINER_NAME"
#   kubectl cp scripts/build-proposal.sh default/agoriclocal-genesis-0:/root/scripts/build-proposal.sh
done < bundles/bundle-list
