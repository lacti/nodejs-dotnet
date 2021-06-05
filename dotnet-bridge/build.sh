#!/bin/bash

set -euxo pipefail

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

dotnet publish -c Release -r linux-x64 /p:PublishSingleFile=true

PACKAGE_FILE="${SCRIPT_PATH}/$(basename "${SCRIPT_PATH}").tar.gz"
PUBLISH_DIR="$PWD/bin/Release/netcoreapp2.1/linux-x64/publish"

rm -f "${PACKAGE_FILE}"

cd "${PUBLISH_DIR}"
  tar cvzf "${PACKAGE_FILE}" *
cd ..

ls -lh "${PACKAGE_FILE}"
cp "${PACKAGE_FILE}" ../nodejs-launcher

