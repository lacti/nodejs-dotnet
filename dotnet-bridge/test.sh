#!/bin/bash

set -euxo pipefail

SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_NAME="$(basename "${SCRIPT_PATH}")"

TEMP_DIR="$(mktemp -d)"
mkdir -p "${TEMP_DIR}"

trap '{ rm -rf -- "${TEMP_DIR}"; }' EXIT

cp "${SCRIPT_PATH}/${PROJECT_NAME}.tar.gz" "${TEMP_DIR}"
cd "${TEMP_DIR}"
tar xf "${PROJECT_NAME}.tar.gz"
cd -

docker run -it \
  -v ${TEMP_DIR}:/tmp \
  -p 7776:7776 \
  -e DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1 \
  --entrypoint "/tmp/${PROJECT_NAME}" \
  public.ecr.aws/lambda/nodejs:14

