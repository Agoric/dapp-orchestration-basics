#!/bin/bash

# set the path to the directory containing the json files inside the kube container
JSON_DIR_PATH="/root/.agoric/cache"

# fetch the json files from the directory
json_files=$(kubectl exec -i agoriclocal-genesis-0 -c validator -- ls ${JSON_DIR_PATH} | grep '\.json$')
echo $json_files
# check if any json files were found
if [ -z "$json_files" ]; then
  echo "No JSON files found in the specified directory."
  exit 1
fi

# loop through each json file
for json_file in $json_files; do
  # construct the full path to the json file
  JSON_FILE_PATH="${JSON_DIR_PATH}/${json_file}"
 
  # fetch the json content using kubectl and extract the endoZipBase64 value
  base64_string=$(kubectl exec -i agoriclocal-genesis-0 -c validator -- cat ${JSON_FILE_PATH} | jq -r '.endoZipBase64')

  # check if the base64 string was extracted successfully
  if [ -z "$base64_string" ]; then
    echo "Failed to extract the endoZipBase64 value from the json file: ${json_file}"
    continue
  fi

  # decode the base64 string and save it as a zip
  mkdir -p ./bundles
  zip_file="./bundles/${json_file%.json}.zip"
  echo ${base64_string} | base64 -d > ${zip_file}

  # check if the zip file was created successfully
  if [ ! -f ${zip_file} ]; then
    echo "Failed to decode the base64 string into a zip file for: ${json_file}"
    continue
  fi

  # create a directory to unzip the contents
  unzip_dir="./bundles/${json_file%.json}_contents"
  mkdir -p ${unzip_dir}

  # unzip the decoded file
  unzip -o ${zip_file} -d ${unzip_dir}

  # check if the unzip operation was successful
  if [ $? -ne 0 ]; then
    echo "Failed to unzip the decoded zip file for: ${json_file}"
    continue
  fi

  # inspect the contents of the unzipped bundle
  echo "Contents of the bundle for ${json_file}:"
  ls -l ${unzip_dir}
done